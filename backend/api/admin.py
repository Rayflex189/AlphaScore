from django.contrib import admin
from .models import Profile, ConnectedAccount, Trade, Opportunity, Application, Challenge, UserChallenge

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'country', 'style', 'alpha_score', 'is_verified')
    list_filter = ('role', 'is_verified', 'country')
    search_fields = ('user__username', 'user__email', 'biography')

@admin.register(ConnectedAccount)
class ConnectedAccountAdmin(admin.ModelAdmin):
    list_display = ('user', 'broker', 'login_id', 'server', 'is_active', 'last_synced')
    list_filter = ('broker', 'is_active')
    search_fields = ('user__username', 'login_id', 'server')

@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    list_display = ('ticket', 'account', 'symbol', 'trade_type', 'lots', 'profit', 'close_time')
    list_filter = ('symbol', 'trade_type', 'stop_loss_used')
    search_fields = ('ticket', 'account__login_id', 'account__user__username')

@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = ('investor', 'type', 'min_score', 'max_drawdown', 'budget')
    list_filter = ('risk_profile', 'min_score')
    search_fields = ('investor', 'type', 'description')

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'opportunity', 'status', 'applied_at')
    list_filter = ('status',)
    search_fields = ('user__username', 'opportunity__investor', 'pitch')

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('title', 'difficulty', 'duration', 'target_score', 'limit_drawdown')
    list_filter = ('difficulty',)
    search_fields = ('title', 'description')

@admin.register(UserChallenge)
class UserChallengeAdmin(admin.ModelAdmin):
    list_display = ('user', 'challenge', 'status', 'current_days', 'current_drawdown', 'start_date')
    list_filter = ('status',)
    search_fields = ('user__username', 'challenge__title')
