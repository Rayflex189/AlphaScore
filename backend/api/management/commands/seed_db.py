import random
from datetime import datetime, timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Challenge, Opportunity, Profile, ConnectedAccount, Trade

class Command(BaseCommand):
    help = 'Seeds default data for Challenges, Opportunities, and Leaderboard Traders'

    def handle(self, *args, **options):
        self.stdout.write('Clearing database...')
        Trade.objects.all().delete()
        ConnectedAccount.objects.all().delete()
        Challenge.objects.all().delete()
        Opportunity.objects.all().delete()
        User.objects.filter(username__in=[
            'yuki_sato', 'sofia_martinez', 'amara_diop', 'liam_oconnor', 'kwame_mensah', 'chloe_dubois'
        ]).delete()

        self.stdout.write('Seeding database...')

        # 1. Seed Challenges
        challenges_data = [
            {
                'title': 'Low Drawdown Master Class',
                'difficulty': 'Hard',
                'duration': '30 Days',
                'target_score': 88,
                'limit_drawdown': Decimal('4.00'),
                'reward_badge': 'Drawdown Guard',
                'badge_color': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
                'participants': 1420,
                'success_rate': '12%',
                'description': 'Complete 30 trading days with a maximum drawdown of 4% and a minimum profit factor of 1.8. Earn the Drawdown Guard credential.'
            },
            {
                'title': 'High Consistency Challenge',
                'difficulty': 'Medium',
                'duration': '15 Days',
                'target_score': 85,
                'limit_drawdown': Decimal('6.00'),
                'reward_badge': 'Consistency Icon',
                'badge_color': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                'participants': 2310,
                'success_rate': '28%',
                'description': 'Execute trades with steady sizing and consistent daily profits. Lot size deviation must remain below 0.3. Earn the Consistency Icon badge.'
            },
            {
                'title': 'Prop Firm Prep Challenge',
                'difficulty': 'Expert',
                'duration': '45 Days',
                'target_score': 90,
                'limit_drawdown': Decimal('5.00'),
                'reward_badge': 'Prop Verified',
                'badge_color': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                'participants': 840,
                'success_rate': '5%',
                'description': 'Align with institutional risk guidelines. Maintain tight stop losses, limit weekly drawdown, and achieve a 10% return goal. Earn the Prop Verified badge.'
            }
        ]

        for item in challenges_data:
            Challenge.objects.get_or_create(
                title=item['title'],
                defaults=item
            )
        self.stdout.write(self.style.SUCCESS('Challenges seeded.'))

        # 2. Seed Opportunities
        opportunities_data = [
            {
                'investor': 'Apex Capital Partners',
                'logo': '💼',
                'type': 'Swing Traders',
                'min_score': 85,
                'max_drawdown': Decimal('5.00'),
                'min_track_record': '12 Months',
                'risk_profile': 'Low',
                'budget': Decimal('500000.00'),
                'description': 'Looking to allocate capital to disciplined Swing Traders specializing in major G10 currencies. Proven risk management is our highest criteria.'
            },
            {
                'investor': 'Horizon Alpha Fund',
                'logo': '🌐',
                'type': 'Scalpers',
                'min_score': 90,
                'max_drawdown': Decimal('4.00'),
                'min_track_record': '6 Months',
                'risk_profile': 'Medium',
                'budget': Decimal('250000.00'),
                'description': 'Seeking high-frequency scalpers with robust consistency metrics. Rapid execution, low latency setup verification required.'
            },
            {
                'investor': 'Genesis Crypto Ventures',
                'logo': '🪙',
                'type': 'Crypto Traders',
                'min_score': 80,
                'max_drawdown': Decimal('10.00'),
                'min_track_record': '6 Months',
                'risk_profile': 'High',
                'budget': Decimal('1000000.00'),
                'description': 'Looking for traders to handle leveraged crypto asset management. Must demonstrate profitability across Bitcoin and Ether volatility.'
            }
        ]

        for item in opportunities_data:
            Opportunity.objects.get_or_create(
                investor=item['investor'],
                defaults=item
            )
        self.stdout.write(self.style.SUCCESS('Opportunities seeded.'))

        # 3. Seed Leaderboard Traders (Yuki, Sofia, Chloe, Kwame, Liam, Amara)
        traders_data = [
            {
                'username': 'yuki_sato',
                'email': 'yuki@alphascore.com',
                'country': 'Japan',
                'style': 'Scalper',
                'experience': '8 Years',
                'alpha_score': 96,
                'verified': True,
                'funding': False,
                'bio': 'High frequency scalper operating in Asian/London sessions. Dynamic size scaling based on order flow variance.'
            },
            {
                'username': 'sofia_martinez',
                'email': 'sofia@alphascore.com',
                'country': 'Spain',
                'style': 'Day Trader',
                'experience': '4 Years',
                'alpha_score': 89,
                'verified': True,
                'funding': True,
                'bio': 'Intraday breakout trader focusing on EURUSD, GBPUSD and DAX index. strict 1% daily stop limit.'
            },
            {
                'username': 'amara_diop',
                'email': 'amara@alphascore.com',
                'country': 'Senegal',
                'style': 'Swing Trader',
                'experience': '6 Years',
                'alpha_score': 93,
                'verified': True,
                'funding': True,
                'bio': 'Macroeconomic framework swing trader. Hold positions for 3-5 days. Risk-mitigated portfolio approach.'
            },
            {
                'username': 'liam_oconnor',
                'email': 'liam@alphascore.com',
                'country': 'Ireland',
                'style': 'Crypto Trader',
                'experience': '3 Years',
                'alpha_score': 82,
                'verified': True,
                'funding': True,
                'bio': 'Crypto asset swing trader. Focus on BTCUSD leverage management and spot altcoin rotation.'
            },
            {
                'username': 'kwame_mensah',
                'email': 'kwame@alphascore.com',
                'country': 'Ghana',
                'style': 'Scalper',
                'experience': '7 Years',
                'alpha_score': 94,
                'verified': True,
                'funding': True,
                'bio': 'Proprietary level scalper specializing in EURUSD and spot Gold. High execution speed, tight stop margins.'
            },
            {
                'username': 'chloe_dubois',
                'email': 'chloe@alphascore.com',
                'country': 'France',
                'style': 'Day Trader',
                'experience': '5 Years',
                'alpha_score': 87,
                'verified': False,
                'funding': True,
                'bio': 'Trend follower in European hours. Daily focus on Gold and Crude oil assets.'
            }
        ]

        for item in traders_data:
            user, created = User.objects.get_or_create(
                username=item['username'],
                email=item['email']
            )
            if created:
                user.set_password('password123')
                user.save()

            # Update Profile
            profile = user.profile
            profile.country = item['country']
            profile.style = item['style']
            profile.experience = item['experience']
            profile.alpha_score = item['alpha_score']
            profile.is_verified = item['verified']
            profile.available_for_funding = item['funding']
            profile.biography = item['bio']
            profile.save()

            # Create an account & seed a few trades to ensure dynamic stats work
            acc, _ = ConnectedAccount.objects.get_or_create(
                user=user,
                broker='MT5',
                defaults={
                    'login_id': f"804{user.id:04d}",
                    'server': 'Demo-Server'
                }
            )
            
            # Create a couple of trades for calculations
            Trade.objects.get_or_create(
                ticket=f"T-SEED-{user.username}-1",
                defaults={
                    'account': acc,
                    'symbol': 'EURUSD',
                    'trade_type': 'buy',
                    'lots': Decimal('1.00'),
                    'profit': Decimal('300.00'),
                    'open_time': datetime.now() - timedelta(days=2),
                    'close_time': datetime.now() - timedelta(days=2) + timedelta(hours=2),
                    'stop_loss_used': True
                }
            )
            Trade.objects.get_or_create(
                ticket=f"T-SEED-{user.username}-2",
                defaults={
                    'account': acc,
                    'symbol': 'GBPUSD',
                    'trade_type': 'sell',
                    'lots': Decimal('1.00'),
                    'profit': Decimal('-100.00'),
                    'open_time': datetime.now() - timedelta(days=1),
                    'close_time': datetime.now() - timedelta(days=1) + timedelta(hours=1),
                    'stop_loss_used': True
                }
            )

        self.style.SUCCESS('Leaderboard traders seeded.')
        self.stdout.write(self.style.SUCCESS('Seed database completed.'))
