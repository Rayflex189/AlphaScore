from django.urls import path
from .views import (
    RegisterView, LoginView, ProfileView, LeaderboardView,
    ConnectAccountView, StatsView, MarketplaceView, ApplyOpportunityView,
    ChallengeView, UserChallengeView, SimulateChallengeDayView, ClaimBadgeView,
    ApplicationDecisionView
)

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    
    # Profile
    path('profile/', ProfileView.as_view(), name='profile'),
    
    # Live stats & broker links
    path('accounts/connect/', ConnectAccountView.as_view(), name='connect_account'),
    path('stats/', StatsView.as_view(), name='stats'),
    
    # Leaderboard
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    
    # Marketplace
    path('marketplace/', MarketplaceView.as_view(), name='marketplace'),
    path('marketplace/apply/', ApplyOpportunityView.as_view(), name='marketplace_apply'),
    path('marketplace/applications/<int:pk>/decision/', ApplicationDecisionView.as_view(), name='app_decision'),
    
    # Challenges
    path('challenges/', ChallengeView.as_view(), name='challenges'),
    path('challenges/enroll/', UserChallengeView.as_view(), name='challenges_enroll'),
    path('challenges/simulate/', SimulateChallengeDayView.as_view(), name='challenges_simulate'),
    path('challenges/claim/', ClaimBadgeView.as_view(), name='challenges_claim'),
]
