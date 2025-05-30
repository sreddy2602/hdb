namespace my.sample;
 
entity Products {
  key ID    : UUID;
  name      : String;
  category  : String;
  price     : Decimal(10,2);
  stock     : Integer;
}
 
 