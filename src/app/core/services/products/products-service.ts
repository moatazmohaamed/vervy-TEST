import { inject, Injectable, OnInit } from '@angular/core';
import { SupabaseService } from '../supabase/supabase-service';
import { IProduct } from '../../../shared/interfaces/IProducts';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private supabaseService = inject(SupabaseService);

  async getProducts() {
    const { data, error } = await this.supabaseService.client.from('products').select('*');

    if (error) throw error;
    return data;
  }

  // async addProduct(product: Omit<IProduct, 'id' | 'created_at' | 'updated_at'>): Promise<IProduct> {
  //   const { data, error } = await this.supabaseService.client
  //     .from('products')
  //     .insert([product])
  //     .select()
  //     .single();

  //   if (error) throw error;
  //   console.log(data);
  //   return data as IProduct;
  // }

  async getProductById(id: string): Promise<IProduct | null> {
    const { data, error } = await this.supabaseService.client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as IProduct;
  }
}
