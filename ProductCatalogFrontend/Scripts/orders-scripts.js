$(document).ready(function () {
    var apiUrl = 'https://localhost:44303/api/orders';

    function loadOrders() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            dataType: 'json',
            success: function (orders) {
                $('#orders-list').empty();
                orders.forEach(function (order) {
                    var orderHtml = '<tr>';
                    orderHtml += '<td>' + order.Id + '</td>';
                    orderHtml += '<td>' + order.CustomerName + '</td>';
                    orderHtml += '<td>' + order.Address + '</td>';
                    orderHtml += '<td>' + new Date(order.OrderDate).toLocaleDateString() + '</td>';
                    orderHtml += '<td>';
                    order.Items.forEach(function (item) {
                        orderHtml += item.ProductName + ' (x' + item.Quantity + ')<br>';
                    });
                    orderHtml += '</td>';
                    orderHtml += '<td>' + order.Status + '</td>';
                    orderHtml += '<td><button class="btn btn-primary dispatch-button" data-id="' + order.Id + '">Dispatched</button></td>';
                    orderHtml += '<td><button class="btn btn-success close-button" data-id="' + order.Id + '">Close</button></td>';
                    orderHtml += '<td><button class="btn btn-danger cancel-button" data-id="' + order.Id + '">Cancel</button></td>';

                    orderHtml += '</tr>';
                    $('#orders-list').append(orderHtml);
                });
                $('#orders-table').DataTable();
            },
            error: function (xhr, status, error) {
                console.error('Error al cargar órdenes:', status, error);
            }
        });
    }

    $(document).on('click', '.dispatch-button', function () {
        var orderId = $(this).data('id');
        fnUpdateOrder(orderId, 'Dispatch')
    });

    $(document).on('click', '.close-button', function () {
        var orderId = $(this).data('id');
        fnUpdateOrder(orderId, 'Close')
    });

    $(document).on('click', '.cancel-button', function () {
        var orderId = $(this).data('id');
        fnUpdateOrder(orderId, 'Cancel')
    });

    function fnUpdateOrder(id, status) {
        var order = {
            id: id,
            Status: status
        }

        $.ajax({
            url: apiUrl + '/' + id,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(order),
            success: function () {
                alert('Order marked as ' + status);
                loadOrders();
            },
            error: function (xhr, status, error) {
                console.error('Error al despachar la orden:', status, error);
            }
        });
    }

    loadOrders();

    $('#back-button').click(function () {
        window.location.href = 'admin.html'; 
    });

    $('#back-main-button').click(function () {
        window.location.href = 'index.html';
    });
});