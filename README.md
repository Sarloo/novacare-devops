# NovaCare DevOps

Proyecto final de Fundamentos de DevOps que simula una solucion empresarial en AWS para una clinica ficticia llamada **NovaCare Clinic**. El repositorio contiene dos aplicaciones independientes con frontend, backend, base de datos MySQL, contenedores Docker, scripts Bash, configuracion de CloudWatch y una funcion Lambda para manejar alarmas.

## Internet vs Intranet

La carpeta `landing/` representa la aplicacion publica de Internet. Es una pagina para pacientes y clientes, con informacion de la clinica, servicios medicos, contacto y formulario publico.

La carpeta `intranet/` representa la aplicacion privada de empleados. Es un dashboard administrativo para registrar actividades internas y consultar indicadores operativos. En AWS debe desplegarse en una EC2 privada sin IP publica y accederse solamente desde un Windows bastion o un mecanismo seguro equivalente.

## Tecnologias usadas

- HTML y Bootstrap para los frontends.
- Node.js y Express para los backends.
- MySQL 8 para base de datos.
- Docker y Docker Compose para orquestacion local o en EC2.
- Nginx como servidor web y proxy hacia `/api/`.
- Bash para scripts de despliegue y operacion.
- Amazon CloudWatch Agent para recoleccion de logs.
- AWS Lambda para procesar alarmas.

## Estructura del proyecto

```text
novacare-devops/
├── landing/
│   ├── frontend/
│   ├── backend/
│   ├── db/
│   ├── logs/
│   ├── scripts/
│   └── docker-compose.yml
├── intranet/
│   ├── frontend/
│   ├── backend/
│   ├── db/
│   ├── logs/
│   ├── scripts/
│   └── docker-compose.yml
├── cloudwatch/
├── lambda/
├── README.md
└── .gitignore
```

## Desplegar landing publica

```bash
cd landing
chmod +x scripts/*.sh
./scripts/deploy.sh
```

Abrir en el navegador:

```text
http://IP_PUBLICA_EC2/
```

## Desplegar intranet privada

Deten la landing si estas usando la misma maquina, porque ambas aplicaciones exponen el frontend en el puerto 80.

```bash
cd intranet
chmod +x scripts/*.sh
./scripts/deploy.sh
```

Abrir desde la red privada o bastion autorizado:

```text
http://IP_PRIVADA_EC2/
```

## Ver logs

Los backends escriben logs internos en `/app/logs/app.log`, montado desde `./logs/app.log` en cada aplicacion.

```bash
cd landing
./scripts/view_logs.sh
```

```bash
cd intranet
./scripts/view_logs.sh
```

## Entrar a MySQL

Landing:

```bash
cd landing
docker exec -it novacare_landing_db mysql -uroot -proot123 novacare
SELECT * FROM contactos;
```

Intranet:

```bash
cd intranet
docker exec -it novacare_intranet_db mysql -uroot -proot123 novacare_intranet
SELECT * FROM bitacora;
```

## Bases de datos

La landing usa la base `novacare` y la tabla `contactos`, donde se guardan nombre, correo, mensaje y fecha de creacion de los contactos publicos.

La intranet usa la base `novacare_intranet` y la tabla `bitacora`, donde se guardan empleado, actividad y fecha de creacion de actividades internas.

## Docker Compose

Cada aplicacion tiene su propio `docker-compose.yml` con tres servicios:

- `frontend`: Nginx expone el sitio en el puerto 80 y redirige `/api/` al backend.
- `backend`: Node.js con Express corre internamente en el puerto 3000.
- `db`: MySQL 8 con volumen persistente para conservar datos.

La contrasena `root123` se usa solo por simplicidad academica. En produccion se deben usar variables de entorno seguras, AWS Secrets Manager o un mecanismo equivalente.

## CloudWatch y Lambda

Los archivos en `cloudwatch/` configuran el agente de CloudWatch para leer:

- `/home/ec2-user/novacare-devops/landing/logs/app.log` hacia `/novacare/landing`.
- `/home/ec2-user/novacare-devops/intranet/logs/app.log` hacia `/novacare/intranet`.

La funcion `lambda/lambda_error_handler.py` recibe eventos de alarmas de CloudWatch, imprime el evento JSON y responde con `statusCode 200` junto con fecha y hora en UTC.

## Seguridad

La intranet no debe exponerse a Internet. En una arquitectura AWS recomendada, la landing estaria en una EC2 publica o detras de un balanceador publico, mientras que la intranet estaria en una EC2 privada sin IP publica. El acceso administrativo debe realizarse desde un Windows bastion, VPN o Session Manager con permisos controlados.

## Checklist de capturas para el reporte

- Landing publica abierta en navegador.
- Formulario publico enviado correctamente.
- Boton de prueba de backend en landing.
- Boton de ERROR en landing y evidencia en `logs/app.log`.
- Intranet abierta desde entorno privado.
- Dashboard interno consultado.
- Registro de actividad interna guardado.
- Boton de ERROR en intranet y evidencia en `logs/app.log`.
- Contenedores ejecutandose con `docker compose ps`.
- Consulta MySQL mostrando registros en `contactos`.
- Consulta MySQL mostrando registros en `bitacora`.
- CloudWatch Log Groups `/novacare/landing` y `/novacare/intranet`.
- Lambda ejecutada con evento de prueba de alarma.
