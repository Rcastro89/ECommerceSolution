$(document).ready(function () {
    var apiUrl = 'https://localhost:44370/api/products';

    // Fetch and display products for admin
    function fetchProducts() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (data) {
                var adminProductList = $('#admin-product-list');
                adminProductList.empty();
                data.forEach(function (product) {
                    var row = '<tr data-id="' + product.Id + '">' +
                        '<td><span class="editable" id="Name' + product.Id + '">' + product.Name + '</span></td>' +
                        '<td><span class="editable" id="Price' + product.Id + '">' + product.Price.toFixed(2) + '</span></td>' +
                        '<td><span class="editable" id="Description' + product.Id + '">' + product.Description + '</span></td>' +
                        '<td>' +
                        '<button class="edit-product add-to-cart" data-id="' + product.Id + '">Edit</button>' +
                        '<button class="delete-product delete-btn" data-id="' + product.Id + '">Delete</button>' +
                        '</td>' +
                        '</tr>';
                    adminProductList.append(row);
                });
                $('#admin-table').DataTable();

            }
        });
    }

    $(document).on('click', '.save-changes', function () {
        var $row = $(this).closest('tr');
        var productId = $row.data('id');
        var updatedProduct = {
            Id: productId,
            Name: $('#inputIdName' + productId).val(),
            Price: parseFloat($('#inputIdPrice' + productId).val()),
            Description: $('#inputIdDescription' + productId).val()
        };

        $.ajax({
            url: apiUrl + '/' + productId,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedProduct),
            success: function (response) {
                console.log('Producto actualizado exitosamente:', response);
                fetchProducts();
            },
            error: function (xhr, status, error) {
                console.error('Error al actualizar el producto:', status, error);
            }
        });
    });

    fetchProducts();

    // Handle form submission for adding/editing product
    $('#product-form').submit(function (e) {
        e.preventDefault();

        var newProduct = {
            Name: $('#product-name').val(),
            Price: parseFloat($('#product-price').val()),
            Description: $('#product-description').val()
        };

        $.ajax({
            url: apiUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newProduct),
            success: function () {
                $('#addProductModal').modal('hide');
                fetchProducts();
            },
            error: function (xhr, status, error) {
                console.error('Error al agregar producto:', status, error);
            }
        });
    });

    $(document).on('click', '.edit-product', function () {
        var $row = $(this).closest('tr');

        $row.find('.editable').each(function () {
            var currentValue = $(this).text().trim();
            $(this).html('<input type="text" class="form-control" id="inputId' + $(this)[0].id + '" value="' + currentValue + '">');
        });

        // Cambiar el botón "Editar" a "Guardar Cambios"
        $(this).text('Guardar Cambios').removeClass('edit-product').addClass('save-changes');
    });

    // Handle edit product button click
    $('#admin-product-list').on('click', '.edit-product', function () {
        var id = $(this).data('id');
        $.ajax({
            url: apiUrl + '/' + id,
            method: 'GET',
            success: function (product) {
                $('#product-id').val(product.id);
                $('#product-name').val(product.name);
                $('#product-price').val(product.price);
                $('#product-description').val(product.description);
            }
        });
    });

    // Handle delete product button click
    $('#admin-product-list').on('click', '.delete-product', function () {
        var id = $(this).data('id');
        $.ajax({
            url: apiUrl + '/' + id,
            method: 'DELETE',
            success: function () {
                fetchProducts();
            }
        });
    });

    $('#back-button').on('click', function() {
        window.location.href = 'index.html';
    });

    $('#add-product-button').click(function () {
        $('#addProductModal').modal('show');
    });

    $('#orders-button').on('click', function () {
        window.location.href = 'orders.html';
    });
});
