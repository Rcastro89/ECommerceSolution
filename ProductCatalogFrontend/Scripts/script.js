$(document).ready(function () {
    var apiUrl = 'https://localhost:44370/api/products';

    // Carrito de compras
    var cart = [];

    // Función para obtener y mostrar los productos
    function loadProducts() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            dataType: 'json',
            success: function (products) {
                $('#product-list').empty();
                products.forEach(function (product) {
                    var productHtml = '<tr>';
                    productHtml += '<td>' + product.Name + '</td>';
                    productHtml += '<td>' + product.Price.toFixed(2) + '</td>';
                    productHtml += '<td>' + product.Description + '</td>';
                    productHtml += '<td><button class="add-to-cart" data-id="' + product.Id + '" data-name="' + product.Name + '" data-price="' + product.Price + '">Add to Cart</button></td>';
                    productHtml += '</tr>';
                    $('#product-list').append(productHtml);
                });
                $('#product-table').DataTable();
            },
            error: function (xhr, status, error) {
                console.error('Error al cargar productos:', status, error);
            }
        });
    }

    // Función para actualizar el carrito en el DOM
    function updateCart() {
        $('#cart-items').empty();
        cart.forEach(function (item) {
            var itemHtml = '<li>' + item.name + ' - ' + item.quantity + ' x $' + (item.price ? item.price.toFixed(2) : '0.00') + '</li>';
            $('#cart-items').append(itemHtml);
        });
        $('#cart-count').text(cart.length);
    }

    // Cargar productos al cargar la página
    loadProducts();

    // Evento de clic para el botón "Add to Cart"
    $(document).on('click', '.add-to-cart', function () {
        var productId = $(this).data('id');
        var productName = $(this).data('name');
        var productPrice = parseFloat($(this).data('price')); // Asegurarse de que sea un número
        var existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        }
        updateCart();
        alert('Producto ' + productName + ' agregado al carrito');
    });

    // Evento de clic para mostrar/ocultar el carrito
    $('#cart-button').click(function () {
        $('#cart-dropdown').toggle();
    });

    // Evento de clic para confirmar el pedido
    $('#checkout-button').click(function () {
        if (cart.length === 0) {
            alert('El carrito está vacío.');
            return;
        }
        $('#checkoutModal').modal('show');
        
    });

    $('#admin-button').on('click', function () {
        window.location.href = 'admin.html';
    });

    // Evento de clic para confirmar el pedido
    $('#confirmOrder').click(function () {
        var apiOrderUrl = 'https://localhost:44303/api/Orders';

        var customerName = $('#customerName').val();
        var customerAddress = $('#customerAddress').val();

        // Validar que se haya ingresado nombre y dirección
        if (customerName.trim() === '' || customerAddress.trim() === '') {
            alert('Por favor ingrese nombre y dirección.');
            return;
        }

        var order = {
            CustomerName: customerName,
            Address: customerAddress,
            OrderDate: new Date(), // Puedes configurar la fecha del pedido aquí
            Items: [] // Esta lista se llenará con los elementos del carrito
        };

        cart.forEach(function (item) {
            var orderItem = {
                ProductId: item.id,
                ProductName: item.name,
                Quantity: item.quantity,
                Price: item.price
            };
            order.Items.push(orderItem);
        });

        $.ajax({
            url: apiOrderUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(order),
            success: function (data) {
                alert('Pedido confirmado para ' + customerName + '. El codigo de su compra es ' + data.Id + ' Gracias por su compra!');
                $('#checkoutModal').modal('hide'); // Ocultar el modal después de confirmar el pedido

                cart = [];
                updateCart();
                $('#cart-dropdown').hide();
                $('#customerName').val('');
                $('#customerAddress').val('');
            },
            error: function (xhr, status, error) {
                console.error('Error al confirmar el pedido:', status, error);
                alert('Hubo un error al confirmar el pedido. Por favor, inténtelo nuevamente.');
            }
        });
    });
});
