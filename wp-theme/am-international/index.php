<?php
/**
 * Post listing. Used for the blog page, archives and as the final fallback.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

get_header();

if ( is_home() && get_option( 'page_for_posts' ) ) {
	$title = get_the_title( get_option( 'page_for_posts' ) );
	$lede  = get_the_excerpt( get_option( 'page_for_posts' ) );
} elseif ( is_archive() ) {
	$title = get_the_archive_title();
	$lede  = get_the_archive_description();
} elseif ( is_search() ) {
	/* translators: %s: search term */
	$title = sprintf( __( 'Results for “%s”', 'am-international' ), get_search_query() );
	$lede  = '';
} else {
	$title = __( 'News', 'am-international' );
	$lede  = __( 'Teaching, testimony, field reports and what God is doing on campus.', 'am-international' );
}

am_page_hero( $title, $lede, am_crumbs( array( array( wp_strip_all_tags( $title ), '' ) ) ) );
?>

<section class="section">
	<div class="container">
		<?php if ( have_posts() ) : ?>
			<div class="grid grid--3">
				<?php
				while ( have_posts() ) :
					the_post();
					am_card( get_post(), '', get_the_date() );
				endwhile;
				?>
			</div>

			<?php
			the_posts_pagination( array(
				'mid_size'  => 2,
				'class'     => 'pagination',
				'prev_text' => __( 'Previous', 'am-international' ),
				'next_text' => __( 'Next', 'am-international' ),
			) );
			?>
		<?php else : ?>
			<div class="prose" data-reveal>
				<p class="lede"><?php esc_html_e( 'Nothing here yet.', 'am-international' ); ?></p>
				<?php get_search_form(); ?>
			</div>
		<?php endif; ?>
	</div>
</section>

<?php
get_footer();
