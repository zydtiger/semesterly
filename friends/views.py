from django.shortcuts import render
from student.models import Student
from friends.models import FriendRequest
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.db.models import Q



def search_friends(request, query):
    friends = Student.objects.filter(
        Q(user__first_name__icontains=query) |
        Q(user__last_name__icontains=query) |
        Q(user__username__icontains=query)
    )
    friends_json = serializers.serialize('json', friends)
    print(friends_json)

    # Return the JSON response
    return JsonResponse(friends_json, safe=False)


def send_friend_request(request, userId):
    from_user = request.user
    from_student = Student.objects.get(user=from_user)
    to_student = Student.objects.get(user_id=userId)
    friend_request , created = FriendRequest.objects.get_or_create(from_friend=from_student, to_friend=to_student)
 
    if created:
        return HttpResponse('Friend request created', 200)
    else:
        return HttpResponse('Friend request failed', 400)
    
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