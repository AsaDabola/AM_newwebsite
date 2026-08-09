<?php
/**
 * Connect / Grow / Lead / Sent.
 *
 * Each card is a Page chosen in the Customizer, so staff edit the wording on
 * the page itself and the card follows.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

$labels = array(
	__( 'Connect', 'am-international' ),
	__( 'Grow', 'am-international' ),
	__( 'Lead', 'am-international' ),
	__( 'Sent', 'am-international' ),
);

$pages = array();
for ( $i = 1; $i <= 4; $i++ ) {
	$id = absint( am_mod( 'stage_' . $i ) );
	if ( $id && 'publish' === get_post_status( $id ) ) {
		$pages[ $i ] = $id;
	}
}

if ( ! $pages ) {
	return;
}

$see_all = am_mod( 'stages_link' );
?>
<section class="section">
	<div class="container">
		<div class="section-head section-head--split">
			<div data-reveal>
				<?php if ( am_mod( 'stages_eyebrow' ) ) : ?>
					<p class="eyebrow"><?php echo esc_html( am_mod( 'stages_eyebrow' ) ); ?></p>
				<?php endif; ?>
				<h2><?php echo esc_html( am_mod( 'stages_heading' ) ); ?></h2>
			</div>
			<?php if ( $see_all ) : ?>
				<div class="section-head__aside" data-reveal>
					<?php am_link_arrow( $see_all, __( 'Get involved', 'am-international' ) ); ?>
				</div>
			<?php endif; ?>
		</div>

		<div class="grid grid--4">
			<?php foreach ( $pages as $index => $page_id ) : ?>
				<?php am_card( $page_id, $labels[ $index - 1 ], __( 'Learn more', 'am-international' ) ); ?>
			<?php endforeach; ?>
		</div>
	</div>
</section>
