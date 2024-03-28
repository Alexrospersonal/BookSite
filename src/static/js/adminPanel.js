
function previewImage() {
    console.log("___________HEEEEEEEEEE")
    var fileInput = document.getElementById('download_img');
    var imagePreview = document.getElementById('image-preview');

    var file = fileInput.files[0];
    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.src = e.target.result;
        };

        reader.readAsDataURL(file);
    } else {
        // Clear the image preview if no file is selected
        imagePreview.src = '';
    }
}
