<?php
/**
 * Not found.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

get_header();

am_page_hero(
	__( 'This page went on mission.', 'am-international' ),
	__( 'The page you were looking for is not here. Try one of these instead.', 'am-international' ),
	am_crumbs( array( array( __( 'Not found', 'am-international' ), '' ) ) )
);
?>

<section class="section">
	<div class="container">
		<div class="prose" data-reveal>
			<?php get_search_form(); ?>
		</div>

		<div class="grid grid--3" style="margin-top:3rem">
			<?php
			$suggestions = get_posts( array( 'posts_per_page' => 3 ) );
			foreach ( $suggestions as $item ) {
				am_card( $item, '', get_the_date( '', $item ) );
			}
			?>
		</div>
	</div>
</section>

<?php
get_footer();
