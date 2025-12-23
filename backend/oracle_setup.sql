-- Oracle SQL setup for Laravel/Spatie Permission integration
-- Replace amine with your actual schema name

CREATE ROLE shared_schema;
CREATE ROLE user amine IDENTIFIED BY amine;
GRANT DBA TO amine;
GRANT SELECT, INSERT, UPDATE, DELETE ON amine.personal_access_tokens TO shared_schema;
GRANT SELECT ON amine.PERMISSIONS TO shared_schema;
GRANT SELECT ON amine.MODEL_HAS_PERMISSIONS TO shared_schema;
GRANT SELECT ON amine.ROLES TO shared_schema;
GRANT SELECT ON amine.MODEL_HAS_ROLES TO shared_schema;

CREATE PUBLIC SYNONYM PERSONAL_ACCESS_TOKENS FOR amine.PERSONAL_ACCESS_TOKENS;
CREATE PUBLIC SYNONYM users FOR amine.users;
CREATE PUBLIC SYNONYM sessions FOR amine.sessions;
CREATE PUBLIC SYNONYM PERMISSIONS FOR amine.PERMISSIONS;
CREATE PUBLIC SYNONYM MODEL_HAS_PERMISSIONS FOR amine.MODEL_HAS_PERMISSIONS;
CREATE PUBLIC SYNONYM etudiants FOR amine.etudiants;
CREATE PUBLIC SYNONYM personnels FOR amine.personnels;
CREATE PUBLIC SYNONYM livres FOR amine.livres;
CREATE PUBLIC SYNONYM emprunts FOR amine.emprunts;
CREATE PUBLIC SYNONYM retards FOR amine.retards;
CREATE PUBLIC SYNONYM detail_emprunts FOR amine.detail_emprunts;
CREATE PUBLIC SYNONYM ROLES FOR amine.ROLES;
CREATE PUBLIC SYNONYM MODEL_HAS_ROLES FOR amine.MODEL_HAS_ROLES;
