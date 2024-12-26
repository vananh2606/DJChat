from rest_framework import viewsets
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .models import Server, Category
from .schema import server_list_docs
from .serializer import ServerSerializer, CategorySerializer


class CategoryListViewSet(viewsets.ViewSet):
    queryset = Category.objects.all()

    @extend_schema(responses=CategorySerializer)
    def list(self, request):
        serlializer = CategorySerializer(self.queryset, many=True)
        return Response(serlializer.data)


class ServerListViewSet(viewsets.ViewSet):
    """
    A viewset to handle requests for retrieving a list of servers with optional filtering and annotations.
    """

    queryset = Server.objects.all()
    # permission_classes = [IsAuthenticated]

    @server_list_docs
    def list(self, request):
        """
        Returns a list of servers filtered by various parameters.

        This method retrieves a queryset of servers based on the query parameters
        provided in the `request` object. The following query parameters are supported:

        - `category`: Filters servers by category name.
        - `qty`: Limits the number of servers returned.
        - `by_user`: Filters servers by user ID, only returning servers that the user is a member of.
        - `by_serverid`: Filters servers by server ID.
        - `with_num_members`: Annotates each server with the number of members it has.

        Args:
        request: A Django Request object containing query parameters.

        Returns:
        A queryset of servers filtered by the specified parameters.

        Raises:
        AuthenticationFailed: If the query includes the 'by_user' or 'by_serverid'
            parameters and the user is not authenticated.
        ValidationError: If there is an error parsing or validating the query parameters.
            This can occur if the `by_serverid` parameter is not a valid integer, or if the
            server with the specified ID does not exist.

        Examples:
        To retrieve all servers in the 'gaming' category with at least 5 members, you can make
        the following request:

            GET /servers/?category=gaming&with_num_members=true&num_members__gte=5

        To retrieve the first 10 servers that the authenticated user is a member of, you can make
        the following request:

            GET /servers/?by_user=true&qty=10

        """
        # Lấy các tham số từ query string
        category = request.query_params.get("category")
        qty = request.query_params.get("qty")
        by_user = request.query_params.get("by_user") == "true"
        by_serverid = request.query_params.get("by_serverid")
        with_num_members = request.query_params.get("with_num_members") == "true"

        # Khởi tạo queryset ban đầu
        queryset = self.queryset

        # Lọc theo danh mục
        if category:
            queryset = queryset.filter(category__name=category)

        # Lọc các server mà người dùng hiện tại là thành viên
        if by_user:
            if not request.user.is_authenticated:
                raise AuthenticationFailed("User authentication is required.")
            queryset = queryset.filter(member=request.user.id)

        # Lọc theo ID server
        if by_serverid:
            if not request.user.is_authenticated:
                raise AuthenticationFailed("User authentication is required.")
            try:
                queryset = queryset.filter(id=by_serverid)
                if not queryset.exists():
                    raise ValidationError(f"Server with id {by_serverid} not found.")
            except ValueError:
                raise ValidationError("Invalid server ID format.")

        # Annotate thêm số lượng thành viên nếu cần
        if with_num_members:
            queryset = queryset.annotate(num_members=Count("member"))

        # Giới hạn số lượng kết quả trả về
        if qty:
            try:
                qty = int(qty)
                queryset = queryset[:qty]
            except ValueError:
                raise ValidationError("Invalid value for 'qty'. Must be an integer.")

        # Sử dụng serializer để chuyển đổi queryset thành JSON
        serializer = ServerSerializer(
            queryset,
            many=True,
            context={"num_members": with_num_members},
        )

        # Trả về kết quả JSON
        return Response(serializer.data)
