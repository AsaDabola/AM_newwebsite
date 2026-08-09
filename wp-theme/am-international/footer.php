<?php
/**
 * Footer.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

$email   = am_mod( 'contact_email' );
$address = am_mod( 'contact_address' );
$blurb   = am_mod( 'contact_blurb' );

$socials = array(
	'facebook'  => am_mod( 'social_facebook' ),
	'instagram' => am_mod( 'social_instagram' ),
	'youtube'   => am_mod( 'social_youtube' ),
);
?>
</main>

<?php get_template_part( 'template-parts/global/cta-band' ); ?>

<footer class="footer">
	<div class="container">
		<div class="footer__top">
			<div class="footer__brand">
				<?php echo am_logo(); // phpcs:ignore WordPress.Security.EscapeOutput -- markup built in am_logo(). ?>

				<?php if ( $blurb ) : ?>
					<p><?php echo wp_kses_post( $blurb ); ?></p>
				<?php endif; ?>

				<?php if ( $address || $email ) : ?>
					<p>
						<?php echo $address ? nl2br( esc_html( $address ) ) : ''; ?>
						<?php if ( $email ) : ?>
							<?php echo $address ? '<br>' : ''; ?>
							<a href="mailto:<?php echo esc_attr( $email ); ?>"><?php echo esc_html( $email ); ?></a>
						<?php endif; ?>
					</p>
				<?php endif; ?>

				<?php if ( array_filter( $socials ) || $email ) : ?>
					<ul class="social">
						<?php foreach ( $socials as $name => $url ) : ?>
							<?php if ( $url ) : ?>
								<li>
									<a href="<?php echo esc_url( $url ); ?>" aria-label="<?php echo esc_attr( ucfirst( $name ) ); ?>" rel="noopener" target="_blank">
										<?php echo am_icon( $name ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
									</a>
								</li>
							<?php endif; ?>
						<?php endforeach; ?>
						<?php if ( $email ) : ?>
							<li>
								<a href="mailto:<?php echo esc_attr( $email ); ?>" aria-label="<?php esc_attr_e( 'Email', 'am-international' ); ?>">
									<?php echo am_icon( 'mail' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
								</a>
							</li>
						<?php endif; ?>
					</ul>
				<?php endif; ?>

				<?php if ( is_active_sidebar( 'footer-note' ) ) : ?>
					<?php dynamic_sidebar( 'footer-note' ); ?>
				<?php endif; ?>
			</div>

			<div class="footer__cols">
				<?php
				for ( $i = 1; $i <= 4; $i++ ) :
					$location = 'footer_' . $i;
					if ( ! has_nav_menu( $location ) ) {
						continue;
					}
					$menu_object = wp_get_nav_menu_object( get_nav_menu_locations()[ $location ] ?? 0 );
					?>
					<div class="footer__col">
						<?php if ( $menu_object ) : ?>
							<h3><?php echo esc_html( $menu_object->name ); ?></h3>
						<?php endif; ?>
						<?php am_simple_menu( $location ); ?>
					</div>
				<?php endfor; ?>
			</div>
		</div>

		<div class="footer__bottom">
			<p>
				&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?>
				<?php bloginfo( 'name' ); ?>.
				<?php esc_html_e( 'All rights reserved.', 'am-international' ); ?>
			</p>
			<?php if ( has_nav_menu( 'legal' ) ) : ?>
				<?php am_simple_menu( 'legal', 'footer__legal' ); ?>
			<?php endif; ?>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
