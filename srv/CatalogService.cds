using { my.sample as my } from '../db/data-model';

service CatalogService {
  entity Products as projection on my.Products;
}