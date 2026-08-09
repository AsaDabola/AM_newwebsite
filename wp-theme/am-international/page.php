<?php
/**
 * Single page.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

get_header();

while ( have_posts() ) :
	the_post();

	$crumbs = am_crumbs();
	$parent = wp_get_post_parent_id( get_the_ID() );
	if ( $parent ) {
		$crumbs[] = array( get_the_title( $parent ), get_permalink( $parent ) );
	}
	$crumbs[] = array( get_the_title(), '' );

	am_page_hero( get_the_title(), get_the_excerpt(), $crumbs );
	?>

	<section class="section">
		<div class="container">
			<div class="prose entry-content" data-reveal>
				<?php
				the_content();
				wp_link_pages( array(
					'before' => '<nav class="pagination">',
					'after'  => '</nav>',
				) );
				?>
			</div>
		</div>
	</section>

	<?php
endwhile;

get_footer();
