import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'prueba_tecnica_frontend';

  usuarios: Array<{
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
  }>;
  buscador: FormGroup;
  usuario: FormGroup;
  paises: Array<any> = [
    {
      name: {
        common: 'Seleccione un pais',
      },
    },
  ];
  categorias: any = [
    {
      id: 0,
      categoria: 'Seleccione una categoria',
    },
  ];
  usuarioPost = {
    cedula: '',
    nombres: '',
    apellidos: '',
    email: '',
    pais: '',
    direccion: '',
    celular: '',
    id_categoria: '',
  };

  flagBuscar = false;
  flagEdicion = false;

  constructor(private appServcie: AppService) {
    this.buscador = new FormGroup({
      cedula: new FormControl(''),
    });
    this.usuario = new FormGroup({
      cedula: new FormControl('', [Validators.required]),
      nombres: new FormControl('', [
        Validators.minLength(5),
        Validators.maxLength(100),
        Validators.pattern('[a-zA-Z ]*'),
      ]),
      apellidos: new FormControl('', [
        Validators.maxLength(100),
        Validators.pattern('[a-zA-Z ]*'),
      ]),
      email: new FormControl('', [Validators.maxLength(100), Validators.email]),
      pais: new FormControl('0'),
      direccion: new FormControl('', Validators.maxLength(180)),
      celular: new FormControl('', [
        Validators.maxLength(10),
        Validators.pattern('[0-9]*'),
      ]),
      categoria: new FormControl('0'),
    });
    this.usuarios = new Array<{
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
    }>();
  }

  ngOnInit(): void {
    this.getUsuarios();
    this.cargarPaises();
    this.cargarCategorias();
  }

  getUsuarios() {
    this.appServcie.getUsuarios().subscribe((response) => {
      console.log(response);
      this.usuarios = response;
      this.usuarios.forEach((el) => {
        this.getCategoria(el, el['id_categoria']);
      });
    });
  }

  getCategoria(el: any, id_categoria: any) {
    this.appServcie.getCategoriaXId(id_categoria).subscribe((res) => {
      el.categoriaData = res;
    });
  }

  cargarEdicion(usuarioObj: any) {
    this.usuario.get('cedula')?.setValue(usuarioObj.cedula);
    this.usuario.get('nombres')?.setValue(usuarioObj.nombres);
    this.usuario.get('apellidos')?.setValue(usuarioObj.apellidos);
    this.usuario.get('email')?.setValue(usuarioObj.email);
    const index = this.paises.findIndex(
      (el) => el.name.common === usuarioObj.pais
    );
    this.usuario.get('pais')?.setValue(index);
    this.usuario.get('direccion')?.setValue(usuarioObj.direccion);
    this.usuario.get('celular')?.setValue(usuarioObj.celular);
    this.usuario.get('categoria')?.setValue(usuarioObj.id_categoria);
  }

  editarUsuario() {
    if (this.usuario.valid) {
      let pais = this.paises[this.usuario.get('pais')?.value];
      this.usuarioPost.cedula = this.usuario.value.cedula;
      this.usuarioPost.nombres = this.usuario.value.nombres;
      this.usuarioPost.apellidos = this.usuario.value.apellidos;
      this.usuarioPost.direccion = this.usuario.value.direccion;
      this.usuarioPost.celular = this.usuario.value.celular;
      this.usuarioPost.email = this.usuario.value.email;
      this.usuarioPost.pais = pais.name.common;
      this.usuarioPost.id_categoria = this.usuario.get('categoria')?.value;
      this.appServcie.editarUsuario(this.usuarioPost).subscribe((res) => {
        alert('El usuario se actualizo satisfactoriamente.');
        this.usuario.reset();
        this.usuario.get('pais')?.setValue('0');
        this.usuario.get('categoria')?.setValue('0');
        this.getUsuarios();
      });
    }else{
      alert('Formulario no valido.')
    }
  }

  eliminarUsuario(usuario: any) {
    this.appServcie.eliminarUsuario(usuario.cedula).subscribe((res) => {
      alert(res.message);
      this.getUsuarios()
    });
  }

  buscarXCedula() {
    const cedula = this.buscador.get('cedula')?.value;
    this.appServcie.getUsuarioXCedula(cedula).subscribe(
      (res) => {
        this.usuarios = [];
        this.usuarios.push(res);
        this.usuarios.forEach((el) => {
          this.getCategoria(el, el['id_categoria']);
        });
        this.flagBuscar = true;
      },
      (err) => {
        alert('Registro no encontrado');
        this.buscador.reset();
      }
    );
  }

  limpiarBuscador() {
    this.getUsuarios();
    this.flagBuscar = false;
    this.buscador.reset();
  }

  crearUsuario() {
    if (this.usuario.valid) {
      let pais = this.paises[this.usuario.get('pais')?.value];
      this.usuarioPost.cedula = this.usuario.value.cedula;
      this.usuarioPost.nombres = this.usuario.value.nombres;
      this.usuarioPost.apellidos = this.usuario.value.apellidos;
      this.usuarioPost.direccion = this.usuario.value.direccion;
      this.usuarioPost.celular = this.usuario.value.celular;
      this.usuarioPost.email = this.usuario.value.email;
      this.usuarioPost.pais = pais.name.common;
      this.usuarioPost.id_categoria = this.usuario.get('categoria')?.value;
      this.appServcie.crearUsuario(this.usuarioPost).subscribe((response) => {
        alert('El usuario se creo satisfactoriamente.');
        this.usuario.reset();
        this.usuario.get('pais')?.setValue('0');
        this.usuario.get('categoria')?.setValue('0');
        this.getUsuarios();
      });
    } else {
      alert('Formulario no valido.');
    }
  }

  cargarPaises() {
    this.appServcie.getPaises().subscribe((response: Array<any>) => {
      response.forEach((element) => {
        this.paises.push(element);
      });
    });
  }

  cargarCategorias() {
    this.appServcie.getCategorias().subscribe((response) => {
      response.forEach((element) => {
        this.categorias.push(element);
      });
    });
  }
}
