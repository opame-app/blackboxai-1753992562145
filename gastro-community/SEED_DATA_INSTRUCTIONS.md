# Instrucciones para Generar Datos de Prueba

## Opción 1: Usando la interfaz web (Recomendado)

1. Inicia sesión como administrador
2. Navega a: `/admin/seed-data`
3. Haz clic en "Generar Datos de Prueba"
4. Espera a que se complete el proceso

## Opción 2: Usando la consola del navegador

1. Abre la aplicación en el navegador
2. Abre las herramientas de desarrollo (F12)
3. Ve a la pestaña "Console"
4. Ejecuta el siguiente comando:

```javascript
// Primero importa el script
import('/src/scripts/seedTestData.js').then(module => {
  // Luego ejecuta la función
  module.seedTestData();
});
```

## Datos que se crearán:

### Proveedores (3):
- **proveedor1@test.com** - Distribuidora La Fresca (Frutas y verduras)
- **proveedor2@test.com** - Carnes Premium SA (Carnes)
- **proveedor3@test.com** - Pescadería del Puerto (Pescados y mariscos)

### Empleados (5):
- **chef1@test.com** - Carlos Rodríguez (Chef - 8 años exp.)
- **cocinero1@test.com** - María González (Cocinero - 5 años exp.)
- **mesero1@test.com** - Juan Pérez (Mesero - 3 años exp.)
- **bartender1@test.com** - Lucía Fernández (Bartender - 6 años exp.)
- **ayudante1@test.com** - Roberto Silva (Ayudante - 2 años exp.)

### Ofertas de Trabajo (5):
- Chef Ejecutivo - Restaurante Italiano
- Bartender para Bar de Cócteles
- Equipo de Meseros - Nuevo Restaurante
- Pastelero/a Profesional
- Ayudantes de Cocina (Sin experiencia)

## Contraseña para todos los usuarios de prueba:
```
test123456
```

## Notas importantes:
- Después de ejecutar el script, deberás volver a iniciar sesión
- Los usuarios creados tendrán perfiles completos con toda la información necesaria
- Las ofertas de trabajo estarán activas y listas para recibir aplicaciones
