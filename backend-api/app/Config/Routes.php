<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->post('post', 'Post::create');
$routes->put('post/(:segment)', 'Post::update/$1', ['filter' => 'apiauth']);
$routes->delete('post/(:segment)', 'Post::delete/$1', ['filter' => 'apiauth']);
$routes->post('api/login', 'Api\Auth::login');

$routes->get('post', 'Post::index');
$routes->get('post/(:segment)', 'Post::show/$1');
$routes->get('kategori', 'Post::kategori');
$routes->post('post/update/(:segment)', 'Post::update/$1', ['filter' => 'apiauth']);

$routes->get('tanggapan/(:segment)', 'Post::getTang/$1');
$routes->post('tanggapan', 'Post::addTang', ['filter' => 'apiauth']);
$routes->delete('tanggapan/(:num)', 'Post::deleteTang/$1', ['filter' => 'apiauth']);