# PartyUp - Backlog de mejoras web

Fecha: 2026-04-08
Estado: propuesta inicial (priorizada)

## Objetivo
Organizar las tareas clave para mejorar seguridad, autenticación, experiencia de usuario y estabilidad general de PartyUp.

## Prioridad Alta (hacer primero)

### 1) Verificación de email en registro
- Problema actual: un usuario puede registrarse sin confirmar que el correo es suyo.
- Mejora:
  - Añadir campos en `users`: `email_verified` (bool), `email_verify_token` (hash), `email_verify_expires_at`.
  - En registro, guardar usuario como no verificado y enviar email con enlace de verificación.
  - Crear endpoint `verifyEmail.php` que valide token + expiración.
  - Bloquear login normal si `email_verified = 0` (mostrar mensaje con reenvío de correo).
  - Criterios de aceptación:
  - Si el token es válido, la cuenta queda verificada.
  - Si el token caduca, se puede pedir reenvío.

### 2) Sesiones con expiración por inactividad + logout real
- Problema actual: al volver a localhost puede aparecer sesión iniciada automáticamente.
- Mejora:
  - Definir timeout de inactividad (ejemplo: 30 min).
  - Guardar `last_activity` en sesión y destruirla si supera el tiempo.
  - Endpoint `logout.php` que borre sesión y cookie de sesión.
  - En frontend, al recibir 401/403, redirigir a login y limpiar estado local.
- Criterios de aceptación:
  - Tras inactividad, cualquier llamada protegida devuelve no autenticado.
  - Al cerrar sesión, al recargar no debe aparecer el usuario logueado.

### 3) Endurecer cookies y sesión PHP
- Mejoras técnicas:
  - Configurar cookie de sesión con `httponly`, `samesite=Lax` (o `Strict` si aplica), `secure` en HTTPS.
  - Hacer `session_regenerate_id(true)` en login.
  - Evitar guardar datos sensibles en frontend (solo lo mínimo).
- Criterios de aceptación:
  - La sesión se renueva al autenticar.
  - Cookie de sesión con flags seguras.

### 4) Flujo de Steam más sólido (autologin controlado)
- Tu idea: si ya inició sesión con Steam una vez, que sea automático.
- Recomendación segura:
  - Vincular `steam_id` a usuario local.
  - Guardar preferencia `auth_provider_preferred` (`local`/`steam`).
  - Autologin Steam solo si existe sesión/cookie válida (no por `steam_id` suelto en frontend).
  - Añadir botón de desvincular Steam desde perfil.
- Criterios de aceptación:
  - Si usuario elige Steam como preferido y su sesión es válida, entra sin pasos extra.
  - Si no hay sesión válida, debe autenticarse correctamente (no acceso automático inseguro).

## Prioridad Media

### 5) Recuperación de contraseña segura
- Implementar “Olvidé mi contraseña”.
- Token de un solo uso, con expiración corta.
- Guardar token hasheado en BD, no en texto plano.

### 6) Reenvío de verificación de email
- Botón para reenviar email de verificación.
- Limitar frecuencia (rate limit, por ejemplo 1 cada 60 segundos).

### 7) Control anti-fuerza-bruta en login
- Límite por IP/correo (intentos fallidos).
- Bloqueo temporal progresivo.
- Mensajes genéricos para no filtrar si existe el usuario.

### 8) Validaciones de input unificadas
- Validar y sanear en backend todos los campos de login/registro/perfil.
- Reglas claras de contraseña (longitud mínima, complejidad opcional).
- Errores consistentes en JSON.

### 9) Respuestas API consistentes
- Estandarizar formato:
  - `success`, `data`, `errorCode`, `message`.
- Evitar HTML/warnings en endpoints JSON.
- Capturar errores con `try/catch` y devolver códigos HTTP correctos.

## Prioridad Baja

### 10) UX de autenticación
- Mensajes más claros en login/registro.
- Estado visual de “correo verificado/no verificado”.
- Indicador de sesión expirada con redirección limpia al login.

### 11) Auditoría básica y trazabilidad
- Registrar eventos clave: login ok/fail, logout, verificación email, reset password.
- No guardar datos sensibles en logs.

### 12) Tests mínimos de autenticación
- Casos recomendados:
  - Registro -> email no verificado no puede entrar.
  - Verificación con token válido/caducado.
  - Timeout por inactividad.
  - Logout invalida sesión.
  - Login Steam vinculado/desvinculado.

---

## Plan sugerido por fases

### Fase 1 (rápida, impacto alto)
1. Logout real + timeout de inactividad.
2. Endurecer cookie/sesión PHP.
3. Estandarizar respuestas API en auth.

### Fase 2
1. Verificación de email completa (registro + endpoint + reenvío).
2. Bloqueo de login para cuentas no verificadas.

### Fase 3
1. Recuperación de contraseña.
2. Anti-fuerza-bruta.
3. Mejoras UX + tests.

## Notas técnicas para tu código actual
- Backend usa sesiones PHP y frontend debe enviar credenciales en llamadas protegidas.
- Endpoints JSON deben forzar `Content-Type: application/json` y manejar errores sin romper formato.
- En importaciones desde Steam, evitar duplicados en tablas puente con `INSERT IGNORE`.
