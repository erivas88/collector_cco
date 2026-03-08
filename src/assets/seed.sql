CREATE TABLE IF NOT EXISTS developer(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,skills TEXT,img TEXT);
INSERT or IGNORE INTO developer VALUES (1, 'Simon', '', 'https://pbs.twimg.com/profile_images/858987821394210817/oMccbXv6_bigger.jpg');
INSERT or IGNORE INTO developer VALUES (2, 'Max', '', 'https://pbs.twimg.com/profile_images/953978653624455170/j91_AYfd_400x400.jpg');
INSERT or IGNORE INTO developer VALUES (3, 'Ben', '', 'https://pbs.twimg.com/profile_images/1060037170688417792/vZ7iAWXV_400x400.jpg');
 
CREATE TABLE IF NOT EXISTS product(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, creatorId INTEGER);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (1, 'Ionic Academy', 1);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (2, 'Software Startup Manual', 1);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (3, 'Ionic Framework', 2);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (4, 'Drifty Co', 2);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (5, 'Drifty Co', 3);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (6, 'Ionicons', 3);


/*CREATE TABLE IF NOT EXISTS estaciones(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, estacionId INTEGER UNIQUE, programaId INTEGER);*/

CREATE TABLE IF NOT EXISTS estaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    estacionId INTEGER UNIQUE,
    programaId INTEGER,
    latitud REAL, -- Columna para latitud
    longitud REAL -- Columna para longitud
);


CREATE TABLE IF NOT EXISTS parametros(id INTEGER PRIMARY KEY AUTOINCREMENT,name varchar, value varchar);
INSERT or IGNORE INTO parametros(id, name, value) VALUES (1, 'Nivel', 'nivel');
INSERT or IGNORE INTO parametros(id, name, value) VALUES (2, 'Caudal', 'caudal');
INSERT or IGNORE INTO parametros(id, name, value) VALUES (3, 'pH', 'ph');
INSERT or IGNORE INTO parametros(id, name, value) VALUES (4, 'Temperatura', 'temperatura');
INSERT or IGNORE INTO parametros(id, name, value) VALUES (5, 'Conductividad','conductividad');
INSERT or IGNORE INTO parametros(id, name, value) VALUES (6, 'Oxigeno Disuelto', 'oxigeno');
INSERT or IGNORE INTO parametros(id, name, value) VALUES (7, 'Turbiedad', 'turbiedad');
INSERT or IGNORE INTO parametros(id, name, value) VALUES (8, 'SDT','sdt');

CREATE TABLE IF NOT EXISTS programas(id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,name varchar, programaId INTEGER);


CREATE TABLE IF NOT EXISTS equipos(id INTEGER PRIMARY KEY AUTOINCREMENT,codigo TEXT,tipo_equipo TEXT, parametro TEXT,tipo TEXT);
INSERT or IGNORE INTO equipos(id, codigo,tipo_equipo,parametro,tipo) VALUES (1, 'GP-S-027','Molinete','Caudal','1');
INSERT or IGNORE INTO equipos(id, codigo,tipo_equipo,parametro,tipo) VALUES (2, 'GP-S-131','Molinete','Caudal','1');
INSERT or IGNORE INTO equipos(id, codigo,tipo_equipo,parametro,tipo) VALUES (3, 'GP-S-283','Molinete','Caudal','1');
INSERT or IGNORE INTO equipos(id, codigo,tipo_equipo,parametro,tipo) VALUES (4, 'GP-S-035','Pozómetro','Nivel','2');
INSERT or IGNORE INTO equipos(id, codigo,tipo_equipo,parametro,tipo) VALUES (5, 'GP-S-114','Pozómetro','Nivel','2');
INSERT or IGNORE INTO equipos(id, codigo,tipo_equipo,parametro,tipo) VALUES (6, 'GP-S-284','Pozómetro','Nivel','2');
INSERT or IGNORE INTO equipos(id, codigo,tipo_equipo,parametro,tipo) VALUES (7, 'GP-S-285','Pozómetro','Nivel','2');
INSERT or IGNORE INTO equipos(id, codigo,tipo_equipo,parametro,tipo) VALUES (9, 'GP-S-301','Flexometro','Nivel','2');
INSERT or IGNORE INTO equipos(id, codigo,tipo_equipo,parametro,tipo) VALUES (11, 'GP-S-087','Equipo','Fisicoquímicos','3');
INSERT or IGNORE INTO equipos(id, codigo,tipo_equipo,parametro,tipo) VALUES (12, 'GP-S-275','Equipo ','Fisicoquímicos','3');
INSERT or IGNORE INTO equipos(id, codigo,tipo_equipo,parametro,tipo) VALUES (14, 'GP-S-249','Sonda','Fisicoquímicos','3');
INSERT or IGNORE INTO equipos(id, codigo,tipo_equipo,parametro,tipo) VALUES (16, 'GP-S-348','Sonda','Fisicoquimicos','3');
INSERT or IGNORE INTO equipos(id, codigo,tipo_equipo,parametro,tipo) VALUES (17, 'GP-S-305','Turbidimetro','Turbiedad','4');



 

CREATE TABLE IF NOT EXISTS usuarios(id INTEGER PRIMARY KEY AUTOINCREMENT,nombre TEXT,apellido TEXT, rut TEXT, estado TEXT);
INSERT or IGNORE INTO usuarios(id, nombre,apellido,rut,estado) VALUES (2, 'Rodrigo','Constanzo','26137981-K','1');
INSERT or IGNORE INTO usuarios(id, nombre,apellido,rut,estado) VALUES (3, 'Consuelo','Gomez','26137985-K','1');
INSERT or IGNORE INTO usuarios(id, nombre,apellido,rut,estado) VALUES (4, 'Makarena','Avila','26137985-K','1');
INSERT or IGNORE INTO usuarios(id, nombre,apellido,rut,estado) VALUES (5, 'Jean','Corrales','26137985-K','1');

CREATE TABLE IF NOT EXISTS programa_estacion(id_pestacion INTEGER PRIMARY KEY AUTOINCREMENT, id_table_mysql INTEGER UNIQUE, id_programa INTEGER,id_estacion INTEGER,nivel_enable varchar,caudal_enable varchar,tempe_enable varchar,ph_enable varchar,conductividad_enable varchar,oxigeno_enable varchar, turbiedad_enable varchar);
CREATE TABLE IF NOT EXISTS monitoreos(id INTEGER PRIMARY KEY AUTOINCREMENT,programa TEXT, estacion TEXT, equipo_nivel TEXT, valor_nivel TEXT, equipo_caudal TEXT,valor_caudal TEXT,equipo_multi TEXT,valor_temperatura TEXT,valor_ph TEXT,valor_conductividad TEXT ,valor_oxigeno TEXT,equipo_turbiedad TEXT,valor_turbiedad,fecha_medicion date, hora_medicion TEXT, ischecked TEXT,serverip varchar,dateserver varchar,latitud varchar,longitud varchar, profundidad varchar, observacion varchar, id_laboratorio varchar, inspector varchar, metodo varchar, tipo_agua varchar, tipo_nivel varchar, hora_nivel varchar, hidroquimico varchar, isotopico varchar, fallido varchar);
CREATE TABLE IF NOT EXISTS historicos(id INTEGER PRIMARY KEY AUTOINCREMENT,certificado varchar,fecha date,estacion varchar,nivel varchar,caudal varchar, ph varchar,temperatura varchar,conductividad varchar, oxigeno varchar, turbiedad varchar, sdt varchar);

