<?php
/**
 * Shared single view for chapters, events and ministries.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

$post_type   = get_post_type();
$archive_url = get_post_type_archive_link( $post_type );
$object      = get_post_type_object( $post_type );
$archive_lbl = $object ? $object->labels->name : __( 'Back', 'am-international' );

// The line under the title differs per type.
$sub = '';
if ( 'am_chapter' === $post_type ) {
	$sub = get_post_meta( get_the_ID(), '_am_location', true );
} elseif ( 'am_event' === $post_type ) {
	$sub = get_post_meta( get_the_ID(), '_am_event_when', true );
} elseif ( 'am_ministry' === $post_type ) {
	$sub = get_post_meta( get_the_ID(), '_am_ministry_tag', true );
}

am_page_hero(
	get_the_title(),
	$sub ? $sub : get_the_excerpt(),
	am_crumbs( array(
		array( $archive_lbl, $archive_url ),
		array( get_the_title(), '' ),
	) )
);

$register = 'am_event' === $post_type ? get_post_meta( get_the_ID(), '_am_event_link', true ) : '';
?>

<section class="section">
	<div class="container">
		<div class="prose entry-content" data-reveal>
			<?php the_content(); ?>

			<?php if ( $register ) : ?>
				<p style="margin-top:2rem">
					<a class="btn btn--lg" href="<?php echo esc_url( $register ); ?>">
						<?php esc_html_e( 'Register', 'am-international' ); ?> <?php echo am_icon( 'arrow' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
					</a>
				</p>
			<?php endif; ?>

			<p style="margin-top:2.5rem">
				<?php am_link_arrow( $archive_url, sprintf( /* translators: %s: post type name */ __( 'All %s', 'am-international' ), strtolower( $archive_lbl ) ) ); ?>
			</p>
		</div>
	</div>
</section>
