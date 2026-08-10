<?php
/**
 * Document head, utility bar, header and mobile drawer.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="https://gmpg.org/xfn/11">
<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="skip-link" href="#main"><?php esc_html_e( 'Skip to content', 'am-international' ); ?></a>

<?php $tagline = am_mod( 'contact_tagline' ); ?>
<div class="utility">
	<div class="container utility__inner">
		<?php if ( $tagline ) : ?>
			<p class="utility__tagline"><?php echo esc_html( $tagline ); ?></p>
		<?php endif; ?>
		<?php if ( has_nav_menu( 'utility' ) ) : ?>
			<?php am_simple_menu( 'utility', 'utility__links' ); ?>
		<?php endif; ?>
	</div>
</div>

<?php
$cta_label = am_mod( 'header_cta_label' );
$cta_url   = am_mod( 'header_cta_url' );
?>
<header class="header">
	<div class="container header__inner">
		<?php echo am_logo(); // phpcs:ignore WordPress.Security.EscapeOutput -- markup built in am_logo(). ?>

		<nav class="nav" aria-label="<?php esc_attr_e( 'Main', 'am-international' ); ?>">
			<ul class="nav__list">
				<?php am_nav_menu( 'primary', 'mega' ); ?>
			</ul>
		</nav>

		<div class="header__actions">
			<?php if ( $cta_label && $cta_url ) : ?>
				<a class="btn" href="<?php echo esc_url( $cta_url ); ?>"><?php echo esc_html( $cta_label ); ?></a>
			<?php endif; ?>
			<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="drawer" aria-label="<?php esc_attr_e( 'Menu', 'am-international' ); ?>">
				<span></span><span></span><span></span>
			</button>
		</div>
	</div>
</header>

<div class="drawer" id="drawer" aria-hidden="true">
	<div class="container">
		<?php am_nav_menu( 'primary', 'drawer' ); ?>
		<?php if ( $cta_label && $cta_url ) : ?>
			<div class="drawer__actions">
				<a class="btn btn--lg" href="<?php echo esc_url( $cta_url ); ?>"><?php echo esc_html( $cta_label ); ?></a>
			</div>
		<?php endif; ?>
	</div>
</div>

<main id="main">
