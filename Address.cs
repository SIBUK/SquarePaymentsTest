using System.ComponentModel.DataAnnotations;

namespace SquareTestApp
{
    public class Address
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string AddressLine1 { get; set; } = string.Empty;
        public string AddressLine2 { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string County { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;          // Post code is now set from the card imput
        public string SquareCountryCode { get; set; } = string.Empty;
        public string EmailAddress { get; set; } = string.Empty;
        public string FullNameOnCard { get; set; } = string.Empty;
    }
}
