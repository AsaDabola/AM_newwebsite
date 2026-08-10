<?php
/**
 * Homepage hero with the interactive globe.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

$btn1_label = am_mod( 'hero_btn1_label' );
$btn1_url   = am_mod( 'hero_btn1_url' );
$btn2_label = am_mod( 'hero_btn2_label' );
$btn2_url   = am_mod( 'hero_btn2_url' );

$stats = array();
for ( $i = 1; $i <= 3; $i++ ) {
	$value = am_mod( 'hero_stat' . $i . '_value' );
	$label = am_mod( 'hero_stat' . $i . '_label' );
	if ( $value || $label ) {
		$stats[] = array( $value, $label );
	}
}
?>
<section class="hero">
	<div class="hero__sky"></div>
	<canvas class="hero__stars" aria-hidden="true"></canvas>
	<div class="hero__horizon"></div>

	<div class="container hero__inner">
		<div class="hero__copy">
			<?php if ( am_mod( 'hero_eyebrow' ) ) : ?>
				<p class="eyebrow eyebrow--on-dark"><?php echo esc_html( am_mod( 'hero_eyebrow' ) ); ?></p>
			<?php endif; ?>

			<h1>
				<?php echo esc_html( am_mod( 'hero_title' ) ); ?>
				<?php if ( am_mod( 'hero_title_accent' ) ) : ?>
					<span class="accent"><?php echo esc_html( am_mod( 'hero_title_accent' ) ); ?></span>.
				<?php endif; ?>
			</h1>

			<?php if ( am_mod( 'hero_lede' ) ) : ?>
				<p class="hero__lede"><?php echo wp_kses_post( am_mod( 'hero_lede' ) ); ?></p>
			<?php endif; ?>

			<?php if ( ( $btn1_label && $btn1_url ) || ( $btn2_label && $btn2_url ) ) : ?>
				<div class="hero__actions">
					<?php if ( $btn1_label && $btn1_url ) : ?>
						<a class="btn btn--lg" href="<?php echo esc_url( $btn1_url ); ?>">
							<?php echo esc_html( $btn1_label ); ?> <?php echo am_icon( 'arrow' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
						</a>
					<?php endif; ?>
					<?php if ( $btn2_label && $btn2_url ) : ?>
						<a class="btn btn--lg btn--ghost-light" href="<?php echo esc_url( $btn2_url ); ?>"><?php echo esc_html( $btn2_label ); ?></a>
					<?php endif; ?>
				</div>
			<?php endif; ?>

			<?php if ( $stats ) : ?>
				<dl class="hero__meta">
					<?php foreach ( $stats as $stat ) : ?>
						<div>
							<dt class="visually-hidden"><?php echo esc_html( $stat[1] ); ?></dt>
							<dd><strong><?php echo esc_html( $stat[0] ); ?></strong> <?php echo esc_html( $stat[1] ); ?></dd>
						</div>
					<?php endforeach; ?>
				</dl>
			<?php endif; ?>
		</div>

		<div class="globe" data-globe>
			<canvas class="globe__canvas"></canvas>
			<div class="globe__atmos"></div>
			<div class="globe__tip" role="status"></div>
			<p class="globe__hint"><?php esc_html_e( 'Drag to explore', 'am-international' ); ?></p>
		</div>
	</div>
</section>
