from django.shortcuts import render
from student.models import Student
from friends.models import FriendRequest
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.db.models import Q
from django.contrib.auth.models import User
from django.core.serializers import serialize


def get_friends(request):
    logged_in_username = request.user
    logged_in_user = request.user
    try:
        logged_in_student = Student.objects.get(user=logged_in_user)
    except Student.DoesNotExist:
        return JsonResponse({'error': 'Student not found'}, status=404)

    friends_queryset = logged_in_student.friends.all()

    # Serialize the queryset to JSON format
    friends_json = serialize('json', friends_queryset, fields=('preferred_name', 'class_year', 'user', 'img_url', 'major'))
    return JsonResponse(friends_json, safe=False)


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
    from_username = request.user
    from_student = Student.objects.get(user__username=from_username)
    to_student = Student.objects.get(user__id=userId)
    print('hahahahhahahah')
    print(from_username, userId)
    print(from_student, to_student)
    friend_request , created = FriendRequest.objects.get_or_create(from_friend=from_student, to_friend=to_student)
 
    if created:
        return HttpResponse('Friend request created', 201)
    else:
        return HttpResponse('Friend request failed', 400)
    
# Gets all users the logged in users sent a friend request to
def requests_sent(request):
    from_username = request.user.username
    from_student = Student.objects.get(user__username=from_username)
    friend_requests = FriendRequest.objects.filter(from_friend=from_student)

    to_student_ids = friend_requests.values_list('to_friend__user', flat=True)
    requests_sent_users = User.objects.filter(id__in=to_student_ids).select_related('student')
    friends = [
        {   
            'userId': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
            'img_url': getattr(user.student, 'img_url', None)  # Safely get img_url or None if student does not exist
        } for user in requests_sent_users
    ]

    return JsonResponse(friends, safe=False)

# Returns requests sent to the logged in user
def requests_received(request):
    to_username = request.user.username
    to_student = Student.objects.get(user__username=to_username)
    # Get all requests sent to this student
    friend_requests = FriendRequest.objects.filter(to_friend=to_student)
    
    from_student_ids = friend_requests.values_list('from_friend__user', flat=True)
    requests_sent_users = User.objects.filter(id__in=from_student_ids).select_related('student')
    friends = [
        {   
            'userId': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
            'img_url': getattr(user.student, 'img_url', None)  # Safely get img_url or None if student does not exist
        } for user in requests_sent_users
    ]

    return JsonResponse(friends, safe=False)


def withdraw_friend_request(request, userId):
    from_username = request.user
    from_student = Student.objects.get(user__username=from_username)
    to_student = Student.objects.get(user__id=userId)
    # Attempt to retrieve the existing friend request
    try:
        friend_request = FriendRequest.objects.get(from_friend=from_student, to_friend=to_student)
        friend_request.delete()
        return HttpResponse('Friend request withdrawn', 200)
    except FriendRequest.DoesNotExist:
        # If no friend request exists, return an error message
        return HttpResponse('No friend request exists to withdraw', 400)
    
def accept_friend_request(request, friendRequestId):
    friend_request = FriendRequest.objects.get(id=friendRequestId)
    
    friend_request.to_friend.friends.add(friend_request.from_friend)
    friend_request.from_friend.friends.add(friend_request.to_friend)
    friend_request.delete()
    return HttpResponse('Friend request accepted', 200)
    #else:
    #    return HttpResponse('Friend request rejected', 400)
    
def reject_friend_request(request, friendRequestId):
    friend_request = FriendRequest.objects.get(id=friendRequestId)
    friend_request.delete()
    return HttpResponse('Friend request rejected', 200)
  #  else:
   #     return HttpResponse('Friend request failed to reject', 400)