# 🏥 SaludYa – Sistema de Gestión de Citas Médicas

## Descripción del Proyecto

**SaludYa** es un sistema web de gestión de citas médicas desarrollado como un **MVP (Producto Mínimo Viable)**, cuyo objetivo es facilitar la administración, programación y seguimiento de citas médicas entre pacientes y profesionales de la salud.

La plataforma permite a los usuarios registrarse, iniciar sesión y gestionar citas médicas de manera intuitiva, rápida y organizada, ofreciendo distintos niveles de acceso según el rol del usuario.

---

## Objetivo

Desarrollar una solución digital funcional para optimizar el proceso de agendamiento de citas médicas, reduciendo tiempos de espera y mejorando la experiencia de pacientes, médicos y administradores del sistema.

---

## Características Principales

### 🔐 Sistema de autenticación

* Inicio de sesión seguro.
* Registro de nuevos pacientes.
* Validación de credenciales.
* Persistencia de usuarios mediante `localStorage`.

### 👤 Gestión de roles

El sistema cuenta con tres tipos de usuario:

#### Paciente

* Agendar citas médicas.
* Consultar citas próximas.
* Ver historial de citas.
* Cancelar citas.
* Actualizar perfil personal.

#### Médico

* Consultar agenda médica.
* Configurar horarios disponibles.
* Ver citas programadas del día.
* Administrar disponibilidad.

#### Administrador

* Visualizar panel administrativo.
* Gestionar usuarios del sistema.
* Consultar citas registradas.
* Supervisar el estado general de la plataforma.

---

## 📅 Sistema de Agendamiento

El sistema incluye:

* Selección de médicos disponibles.
* Calendario interactivo.
* Horarios dinámicos según disponibilidad del médico.
* Validación para evitar doble reserva.
* Confirmación de cita médica.

---

## 🧰 Tecnologías Utilizadas

### Frontend

* **HTML5**
* **CSS3**
* **JavaScript Vanilla (ES6)**

### Persistencia de Datos

* **LocalStorage**

### Diseño UI/UX

* Diseño responsivo.
* Sistema visual basado en Design Tokens.
* Interfaz moderna y amigable.

---

## 📂 Estructura del Proyecto

```plaintext
SaludYa/
│── index.html      # Estructura principal del sistema
│── styles.css      # Estilos globales y componentes visuales
│── app.js          # Lógica de negocio y comportamiento
```

---

## 👥 Cuentas de Demostración

### Paciente

**Correo:** `maria@mail.com`
**Contraseña:** `123456`

### Médico

**Correo:** `mfandino@saludya.com`
**Contraseña:** `med123`

### Administrador

**Correo:** `admin@saludya.com`
**Contraseña:** `admin123`

---

## 🚀 Cómo ejecutar el proyecto

1. Descargar o clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

2. Abrir la carpeta del proyecto.

3. Ejecutar el archivo:

```plaintext
index.html
```

También se recomienda abrirlo mediante una extensión como **Live Server** en Visual Studio Code para una mejor experiencia.

---

## 🏗️ Arquitectura General

El sistema implementa una arquitectura basada en:

### Capa de presentación

Encargada de renderizar interfaces visuales utilizando HTML y CSS.

### Capa de lógica

Implementada en JavaScript para manejar:

* autenticación
* navegación
* gestión de usuarios
* agenda médica
* validaciones
* almacenamiento local

### Capa de persistencia

Uso de `localStorage` para simular almacenamiento de datos sin necesidad de backend.

---

## ✨ Funcionalidades implementadas

* [x] Login de usuarios
* [x] Registro de pacientes
* [x] Roles de usuario
* [x] Dashboard dinámico
* [x] Agenda médica
* [x] Calendario interactivo
* [x] Reserva de citas
* [x] Cancelación de citas
* [x] Gestión de horarios médicos
* [x] Administración de usuarios
* [x] Perfil de usuario
* [x] Persistencia local

---

## 🔮 Mejoras Futuras

* Integración con backend y base de datos real.
* Sistema de notificaciones.
* Recordatorios por correo electrónico.
* Historial clínico digital.
* Videoconsultas.
* Integración con pagos en línea.
* Recuperación de contraseña.
* Panel estadístico avanzado.

---

## 📘 Contexto Académico

Este proyecto fue desarrollado como parte de un proceso académico enfocado en la implementación de un **MVP funcional**, aplicando principios de **Design Thinking**, diseño centrado en el usuario y validación de procesos digitales en salud.

---

## 👨‍💻 Autores:
**Nicolas Andres Reyes Suarez**
**Nicolas Luna Llanos**
**Analisis y diseño de Software**
Proyecto académico – SaludYa
