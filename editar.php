<?php 
include 'inc/funciones/funciones.php';
include 'inc/layouts/header.php';
//echo var_dump($_GET);

$id = filter_var($_GET['id'], FILTER_VALIDATE_INT);//venia como cadena pero con validate lo convierte a entero

if(!$id){
    die('No es vàlido');

}
$resultado = obtenerContacto($id);
$contacto = $resultado->fetch_assoc();

?>

<!-- <pre><?php //echo var_dump($contacto); ?></pre>  -->

<div class="contenedor-barra">
    <div class="contenedor barra">
        <a href="index.php" class="btn volver">Volver</a>
        <h1> Editar Contacto</h1> 


    </div>



</div>

<div class="bg-amarillo contenedor sombra">
     <form id="contacto" action="#">
          <legend>Editar Contacto <span>Todos los campos son obligatorios</span>
          </legend>

         <?php include 'inc/layouts/formulario.php'; ?>
         

     </form>

</div>




<?php include 'inc/layouts/footer.php'; ?>