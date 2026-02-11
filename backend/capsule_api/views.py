from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import generics, mixins, parsers
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from capsule.models import Capsule, CapsuleItem
from .serializers import CapsuleSerializer, CustomUserSerializer, CapsuleItemSerializer
from rest_framework import status
from django.contrib.auth import authenticate


# Create your views here.
class Register(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=CustomUserSerializer, responses={201: CustomUserSerializer})
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = Token.objects.create(user=user)
            return Response(
                {
                    "token": token.key,
                    "user": CustomUserSerializer(user).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Uses email and password to authenticate user
class Login(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="Authenticate User",
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "email": {"type": "string", "format": "email"},
                    "password": {"type": "string"},
                },
                "required": ["email", "password"],
            }
        },
        responses={
            202: CustomUserSerializer,
            400: OpenApiTypes.OBJECT,
        },
    )
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"detail": "Email and passord is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request=request, email=email, password=password)

        if not user or not user.is_active:
            return Response(
                {"details": "invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "token": token.key,
                "user": CustomUserSerializer(user).data,
            },
            status=status.HTTP_202_ACCEPTED,
        )


# Creates a capsule and sets the owner to the current
# authenticated user.
class CreateCapsule(generics.CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CapsuleSerializer

    @extend_schema(
        summary="Create a new time capsule",
        description="Allows an authenticated user to create a new capsule. The 'owner' field is automatically set to the current user.",
        request=CapsuleSerializer,
        responses={201: CapsuleSerializer},
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# Creates a capsule item and attatches it to a capsule
class CreateCapsuleItem(generics.CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CapsuleItemSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    @extend_schema(
        summary="Create an item within a capsule",
        description="Uploads a file/item and attaches it to a specific capsule owned by the user.",
        parameters=[
            OpenApiParameter(
                name="capsule_pk",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="The ID of the capsule this item belongs to",
            ),
        ],
        responses={201: CapsuleItemSerializer},
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        capsule = get_object_or_404(
            Capsule, pk=self.kwargs["capsule_pk"], owner=self.request.user
        )
        serializer.save(capsule=capsule)


# Lists Capsules that have already been delivered.
# (capsules that have not yet been delivered are still buried and inaccessible)
class ListCapsules(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CapsuleSerializer

    def get_queryset(self):  # pyright: ignore
        return Capsule.objects.filter(owner=self.request.user)


class ListCapsuleItems(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CapsuleItemSerializer

    def get_queryset(self):  # pyright: ignore
        capsule = get_object_or_404(
            Capsule, pk=self.kwargs["capsule_pk"], owner=self.request.user
        )
        return CapsuleItem.objects.filter(capsule=capsule)
