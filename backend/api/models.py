from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, default='trader') # 'trader' or 'investor'
    country = models.CharField(max_length=100, default='Nigeria')
    biography = models.TextField(blank=True, default='Swing trader focused on G10 currency models and strict drawdown parameters.')
    style = models.CharField(max_length=50, default='Swing Trader')
    experience = models.CharField(max_length=50, default='5 Years')
    market = models.CharField(max_length=100, default='Forex, Metals')
    goals = models.CharField(max_length=200, default='Establish $500k funded allocation with low daily risk parameters.')
    available_for_funding = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=True)
    alpha_score = models.IntegerField(default=75)
    badges = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class ConnectedAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connected_accounts')
    broker = models.CharField(max_length=50) # 'MT4', 'MT5', 'cTrader'
    login_id = models.CharField(max_length=50)
    server = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    last_synced = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.broker} - {self.login_id} ({self.user.username})"


class Trade(models.Model):
    account = models.ForeignKey(ConnectedAccount, on_delete=models.CASCADE, related_name='trades')
    ticket = models.CharField(max_length=50, unique=True)
    symbol = models.CharField(max_length=20)
    trade_type = models.CharField(max_length=10) # 'buy' or 'sell'
    lots = models.DecimalField(max_digits=10, decimal_places=2)
    profit = models.DecimalField(max_digits=12, decimal_places=2)
    open_time = models.DateTimeField()
    close_time = models.DateTimeField()
    stop_loss_used = models.BooleanField(default=True)

    def __str__(self):
        return f"Trade {self.ticket} ({self.symbol}) - Profit: {self.profit}"


class Opportunity(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_opportunities', null=True, blank=True)
    investor = models.CharField(max_length=100)
    logo = models.CharField(max_length=10, default='💼')
    type = models.CharField(max_length=50) # e.g. 'Swing Traders', 'Scalpers'
    min_score = models.IntegerField(default=80)
    max_drawdown = models.DecimalField(max_digits=5, decimal_places=2, default=5.0)
    min_track_record = models.CharField(max_length=50, default='12 Months')
    risk_profile = models.CharField(max_length=20, default='Low')
    budget = models.DecimalField(max_digits=15, decimal_places=2)
    description = models.TextField()

    def __str__(self):
        return f"Funding Opportunity from {self.investor}"


class Application(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE, related_name='applications')
    pitch = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, default='applied') # 'applied', 'approved', 'rejected'
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Application by {self.user.username} to {self.opportunity.investor}"


class Challenge(models.Model):
    title = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=20) # 'Medium', 'Hard', 'Expert'
    duration = models.CharField(max_length=20)
    target_score = models.IntegerField(default=85)
    limit_drawdown = models.DecimalField(max_digits=5, decimal_places=2, default=5.0)
    reward_badge = models.CharField(max_length=50)
    badge_color = models.CharField(max_length=100)
    participants = models.IntegerField(default=0)
    success_rate = models.CharField(max_length=10, default='15%')
    description = models.TextField()

    def __str__(self):
        return self.title


class UserChallenge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_challenges')
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, related_name='user_enrollments')
    current_drawdown = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    current_days = models.IntegerField(default=0)
    status = models.CharField(max_length=20, default='active') # 'active', 'passed', 'failed'
    start_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} in {self.challenge.title} ({self.status})"
