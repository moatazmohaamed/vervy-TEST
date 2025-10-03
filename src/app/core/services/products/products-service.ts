import { inject, Injectable, OnInit } from '@angular/core';
import { SupabaseService } from '../supabase/supabase-service';
import { IProduct } from '../../../shared/interfaces/IProducts';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private supabaseService = inject(SupabaseService);

  getProducts(): Observable<IProduct[]> {
    return from(
      this.supabaseService.client
        .from('products')
        .select('*')
        .then(({ data, error }) => {
          if (error) throw error;
          return data as IProduct[];
        })
    );
  }

  getProductById(id: string): Observable<IProduct | null> {
    return from(
      this.supabaseService.client
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as IProduct;
        })
    );
  }
}
