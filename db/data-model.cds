namespace my.sample; // or your own namespace

entity Products {
  key ID          : Integer;
      NAME        : String(100);
      DESCRIPTION : String(500);
      CATEGORY    : String(50);
      PRICE       : Decimal(10,2);
      IMAGE       : String(500);
}