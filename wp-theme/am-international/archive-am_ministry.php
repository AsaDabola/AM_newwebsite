<?php
/**
 * Ministries archive.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

get_header();

am_page_hero(
	post_type_archive_title( '', false ),
	__( 'AM has a number of ministries designed to gather people of similar interests and talents — with opportunities to grow in skill and use it to glorify God.', 'am-international' ),
	am_crumbs( array( array( __( 'Ministries', 'am-international' ), '' ) ) )
);
?>

<section class="section">
	<div class="container">
		<?php if ( have_posts() ) : ?>
			<div class="grid grid--3">
				<?php
				while ( have_posts() ) :
					the_post();
					am_card( get_post(), get_post_meta( get_the_ID(), '_am_ministry_tag', true ) );
				endwhile;
				?>
			</div>
		<?php else : ?>
			<p class="lede"><?php esc_html_e( 'No ministries are listed yet.', 'am-international' ); ?></p>
		<?php endif; ?>
	</div>
</section>

<?php
get_footer();
