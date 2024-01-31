using Azure.Storage.Blobs;
using Flurl.Http;

namespace backend.Services
{
    public class AzureBlobServices
    {
        private readonly BlobServiceClient _blobServiceClient;

        public AzureBlobServices(BlobServiceClient blobServiceClient)
        {
            _blobServiceClient = blobServiceClient;
        }

        public async Task uploadFromUrlToContainerAsync(string fileUrl, string fileName, string containerName)
        {
            Stream stream = await fileUrl.GetStreamAsync();
            var slikeContainer = _blobServiceClient.GetBlobContainerClient(containerName);
            slikeContainer.UploadBlob(fileName, stream);

        }
        public  void uploadFileToContainerAsync(IFormFile file, string fileName, string containerName)
        {
            var slikeContainer = _blobServiceClient.GetBlobContainerClient(containerName);
            var slika = file.OpenReadStream();
            slikeContainer.UploadBlob(fileName, slika );

        }
    }
}
