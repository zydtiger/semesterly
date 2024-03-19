from django.shortcuts import render
from student.models import Student
from friends.models import FriendRequest
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.db.models import Q
from django.contrib.auth.models import User
from django.core.serializers import serialize


def get_friends(request):
    logged_in_user = request.user
    try:
        logged_in_student = Student.objects.get(user=logged_in_user)
    except Student.DoesNotExist:
        return JsonResponse({'error': 'Student not found'}, status=404)

    friends_queryset = logged_in_student.friends.all().select_related('user')
    
    friends = [
        {
            'userId': friend.user.id,
            'email': friend.user.email,
            'first_name': friend.user.first_name,
            'last_name': friend.user.last_name,
            'username': friend.user.username,
            'img_url': getattr(friend, 'img_url', None)  # Safely get img_url or None
        } for friend in friends_queryset
    ]

    return JsonResponse(friends, safe=False)


def remove_friend(request, userId):
    try:
        from_username = request.user
        from_student = Student.objects.get(user__username=from_username)
        to_student = Student.objects.get(user__id=userId)
        # Remove the edge between friends
        from_student.friends.remove(to_student)
        to_student.friends.remove(from_student)
        return HttpResponse('Friend removed', 200)
    except Student.DoesNotExist:
        return JsonResponse({'error': 'Student not found'}, status=404)


def search_friends(request, query):
    # Query users and prefetch related Student objects in a single query
    users_with_students = User.objects.filter(
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(username__icontains=query)
    ).select_related('student').only('email', 'first_name', 'last_name', 'username', 'student__img_url')
    
    friends = [
        {   
            'userId': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
            'img_url': getattr(user.student, 'img_url', None)  # Safely get img_url or None if student does not exist
        } for user in users_with_students if hasattr(user, 'student')
    ]
    
    return JsonResponse(friends, safe=False)


def send_friend_request(request, userId):
    try:
        from_username = request.user
        from_student = Student.objects.get(user__username=from_username)
        to_student = Student.objects.get(user__id=userId)
        friend_request, created = FriendRequest.objects.get_or_create(from_friend=from_student, to_friend=to_student)
    
        if created:
            return HttpResponse('Friend request created', status=201)
        else:
            return HttpResponse('Friend request already exists', status=400)
    except Student.DoesNotExist:
        return JsonResponse({'error': 'Student not found'}, status=404)
    

def requests_sent(request):
    try:
        from_username = request.user.username
        from_student = Student.objects.get(user__username=from_username)
        friend_requests = FriendRequest.objects.filter(from_friend=from_student).select_related('to_friend__user')

        friends = [
            {   
                'friendRequestId': friend_request.id,  # Include the FriendRequest id
                'userId': friend_request.to_friend.user.id,
                'email': friend_request.to_friend.user.email,
                'first_name': friend_request.to_friend.user.first_name,
                'last_name': friend_request.to_friend.user.last_name,
                'username': friend_request.to_friend.user.username,
                'img_url': getattr(friend_request.to_friend, 'img_url', None)  # Safely get img_url or None if student does not exist
            } for friend_request in friend_requests
        ]

        return JsonResponse(friends, safe=False)
    except Student.DoesNotExist:
        return JsonResponse({'error': 'Student not found'}, status=404)


def requests_received(request):
    try:
        to_username = request.user.username
        to_student = Student.objects.get(user__username=to_username)
        # Get all requests sent to this student
        friend_requests = FriendRequest.objects.filter(to_friend=to_student).select_related('from_friend__user')
        
        friends = [
            {
                'friendRequestId': friend_request.id,  # Include the FriendRequest ID
                'userId': friend_request.from_friend.user.id,
                'email': friend_request.from_friend.user.email,
                'first_name': friend_request.from_friend.user.first_name,
                'last_name': friend_request.from_friend.user.last_name,
                'username': friend_request.from_friend.user.username,
                'img_url': getattr(friend_request.from_friend, 'img_url', None)  # Safely get img_url or None
            } for friend_request in friend_requests
        ]

        return JsonResponse(friends, safe=False)
    except Student.DoesNotExist:
        return JsonResponse({'error': 'Student not found'}, status=404)


def withdraw_friend_request(request, userId):
    try:
        from_username = request.user
        from_student = Student.objects.get(user__username=from_username)
        to_student = Student.objects.get(user__id=userId)
        # Attempt to retrieve the existing friend request
        friend_request = FriendRequest.objects.get(from_friend=from_student, to_friend=to_student)
        friend_request.delete()
        return HttpResponse('Friend request withdrawn', 200)
    except Student.DoesNotExist:
        return JsonResponse({'error': 'Student not found'}, status=404)
    except FriendRequest.DoesNotExist:
        # If no friend request exists, return an error message
        return JsonResponse({'error': 'No friend request exists to withdraw'}, status=400)
    

def accept_friend_request(request, friendRequestId):
    try:
        friend_request = FriendRequest.objects.get(id=friendRequestId)
        # Create edge between friends
        friend_request.to_friend.friends.add(friend_request.from_friend)
        friend_request.from_friend.friends.add(friend_request.to_friend)
        # Delete the friend request
        friend_request.delete()
        return HttpResponse('Friend request accepted', 200)
    except FriendRequest.DoesNotExist:
        return JsonResponse({'error': 'Friend request not found'}, status=404)
    

def reject_friend_request(request, friendRequestId):
    try:
        friend_request = FriendRequest.objects.get(id=friendRequestId)
        friend_request.delete()
        return HttpResponse('Friend request rejected', 200)
    except FriendRequest.DoesNotExist:
        return JsonResponse({'error': 'Friend request not found'}, status=404)