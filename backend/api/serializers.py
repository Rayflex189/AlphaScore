from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, ConnectedAccount, Trade, Opportunity, Application, Challenge, UserChallenge

class UserSerializer(serializers.ModelSerializer):
    password = serializers.WritingField = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = (
            'id', 'username', 'email', 'role', 'country', 'biography', 'style', 
            'experience', 'market', 'goals', 'available_for_funding', 
            'is_verified', 'alpha_score', 'badges'
        )


class ConnectedAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectedAccount
        fields = '__all__'
        read_only_fields = ('user', 'last_synced')


class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = '__all__'


class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = '__all__'


class ApplicationSerializer(serializers.ModelSerializer):
    investor = serializers.CharField(source='opportunity.investor', read_only=True)
    budget = serializers.DecimalField(source='opportunity.budget', max_digits=15, decimal_places=2, read_only=True)
    logo = serializers.CharField(source='opportunity.logo', read_only=True)
    type = serializers.CharField(source='opportunity.type', read_only=True)
    min_score = serializers.IntegerField(source='opportunity.min_score', read_only=True)
    max_drawdown = serializers.DecimalField(source='opportunity.max_drawdown', max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('user', 'applied_at')


class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = '__all__'


class UserChallengeSerializer(serializers.ModelSerializer):
    challenge_detail = ChallengeSerializer(source='challenge', read_only=True)

    class Meta:
        model = UserChallenge
        fields = '__all__'
        read_only_fields = ('user', 'start_date')
