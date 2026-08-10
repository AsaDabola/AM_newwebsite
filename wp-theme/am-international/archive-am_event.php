<?php
/**
 * Events archive.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

get_header();

am_page_hero(
	post_type_archive_title( '', false ),
	__( 'Where the network gathers — for teaching, worship and sending.', 'am-international' ),
	am_crumbs( array( array( __( 'Events', 'am-international' ), '' ) ) )
);
?>

<section class="section">
	<div class="container">
		<?php if ( have_posts() ) : ?>
			<div class="grid grid--3">
				<?php
				while ( have_posts() ) :
					the_post();
					am_card( get_post(), get_post_meta( get_the_ID(), '_am_event_when', true ) );
				endwhile;
				?>
			</div>
			<?php the_posts_pagination( array( 'class' => 'pagination' ) ); ?>
		<?php else : ?>
			<p class="lede"><?php esc_html_e( 'No events are listed at the moment.', 'am-international' ); ?></p>
		<?php endif; ?>
	</div>
</section>

<?php
get_footer();
