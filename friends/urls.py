from django.urls import path
from friends.views import get_friends, remove_friend, send_friend_request, withdraw_friend_request, accept_friend_request, reject_friend_request, search_friends, requests_sent, requests_received
urlpatterns = [
path('friends/', get_friends, name="get friends"),
path('friends/remove/<int:userId>', remove_friend, name="remove friend"),
path('friends/send_request/<int:userId>', send_friend_request, name="send friend request"),
path('friends/withdraw_request/<int:userId>', withdraw_friend_request, name="withdraw friend request"),
path('friends/requests_sent', requests_sent, name="friend requests sent"),
path('friends/requests_received', requests_received, name="friend requests received"),
path('friends/accept_request/<int:friendRequestId>/', accept_friend_request, name="accept friend request"),
path('friends/reject_request/<int:friendRequestId>/', reject_friend_request, name="reject friend request"),
path('friends/search/<str:query>', search_friends, name="search friends"),
]