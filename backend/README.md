
## About This Project 

This is a backend system created with **Laravel**/**Oracle** to manage a libraries systems


## Clone repo 
```
git clone git@github.com:S1nju/Library-Managment-System.git
cd Library-Managment-System
cp src/.env.example src/.env

```

## Stack needed for the project 

To run this project you need : 
- Oracle 21c xe.
- Composer .
- install the yajra/laravel-oci8 package.

## Setting up the Database
You need to create a specific roles and sysnonyms before you  run this project:
- Run the sql script oracle_setup.sql in sqlplus or sqldeveloper
- **the database is ready to use**


## Setting up the Laravel Project
installation
```
composer install
php artisan key:generate
php artisan migrate

```
RUN 

```
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan serve
```
## API Documentation 

go to ` localhost/docs ` to get the full api docummmentation



