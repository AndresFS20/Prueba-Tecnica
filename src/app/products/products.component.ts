import { Component, OnInit } from '@angular/core';
import { Product } from "../Product";
import { ProductService } from "../product.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductDetailComponent } from "../product-detail/product-detail.component";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  pageSize = 9;
  products2show: Product[] = [];

  constructor(private productService: ProductService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts()
      .subscribe(products => {
        this.products = products;
        this.products2show = products.slice(0, this.pageSize);
      });
  }

  openModal(product: Product) {
    const modalRef = this.modalService.open(ProductDetailComponent);
    modalRef.componentInstance.product = product;
  }

  OnPageChange(event: PageEvent){
    const startIndex = event.pageIndex * event.pageSize;

    let endIndex = startIndex + event.pageSize;

    if(endIndex > this.products.length){
      endIndex = this.products.length;
    }

    this.products2show = this.products.slice(startIndex, endIndex);
  }

  searchByName(str: string){
    if(str.length < 3){
      alert("Porfavor ingresa un nombre valido");
      return;
    }

    this.products2show = this.products.filter(x => x.title.toLowerCase().includes(str.toLowerCase()));
  }

  searchByPrice(minV: string, maxV: string){
    let min = parseInt(minV, 10) || 0; 
    let max = parseInt(maxV, 10) || 0;

    if(min > max){
      alert("Por favor ingresa unos parametros validos");
      return;
    }

    if(max <=0){
      alert("Por favor que el valor maximo sea mayor a 0");
      return;
    }

    if(min < 0){
      alert("El valor minimo no puede ser menor que 0");
      return;
    }

    this.products2show = this.products.filter(x => x.price >= min && x.price <= max);
  }
}
