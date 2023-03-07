import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  baseUrl: string = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getUsuarios() {
    return this.http.get<Array<any>>(this.baseUrl + '/usuarios');
  }

  getUsuarioXCedula(cedula: any) {
    return this.http.get<{
      cedula: number;
      id_categoria: number;
      nombres: string;
      apellidos: string;
      email: string;
      pais: string;
      direccion: string;
      celular: number;
      categoriaData: {
        id: number;
        categoria: string;
      };
    }>(this.baseUrl + '/usuarios/' + cedula);
  }

  crearUsuario(usuario: any) {
    return this.http.post(this.baseUrl + '/usuarios', usuario);
  }

  editarUsuario(usuario: any) {
    return this.http.put(this.baseUrl + '/usuarios/' + usuario.cedula, usuario);
  }

  eliminarUsuario(cedula: any) {
    return this.http.delete<{ message: string }>(
      this.baseUrl + '/usuarios/' + cedula
    );
  }

  getPaises() {
    return this.http.get<Array<any>>(
      'https://restcountries.com/v3.1/region/americas'
    );
  }

  getCategorias() {
    return this.http.get<Array<any>>(this.baseUrl + '/categorias');
  }

  getCategoriaXId(id_categoria: any) {
    return this.http.get(this.baseUrl + '/categorias/' + id_categoria);
  }
}
