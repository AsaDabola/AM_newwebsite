<?php
/**
 * Single post (news article).
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

get_header();

while ( have_posts() ) :
	the_post();

	$blog_id  = get_option( 'page_for_posts' );
	$blog_url = $blog_id ? get_permalink( $blog_id ) : home_url( '/' );

	am_page_hero(
		get_the_title(),
		get_the_excerpt(),
		am_crumbs( array(
			array( __( 'News', 'am-international' ), $blog_url ),
			array( get_the_title(), '' ),
		) )
	);
	?>

	<section class="section">
		<div class="container">
			<?php if ( has_post_thumbnail() ) : ?>
				<div class="prose" data-reveal style="margin-bottom:2.5rem">
					<?php the_post_thumbnail( 'am-feature', array( 'style' => 'border-radius:var(--radius)' ) ); ?>
				</div>
			<?php endif; ?>

			<div class="prose entry-content" data-reveal>
				<p class="card__meta"><?php echo esc_html( get_the_date() ); ?></p>
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
	// Three more posts, so an article is never a dead end.
	$more = get_posts( array(
		'posts_per_page' => 3,
		'post__not_in'   => array( get_the_ID() ),
	) );
	?>
	<?php if ( $more ) : ?>
		<section class="section section--sand">
			<div class="container">
				<div class="section-head" data-reveal>
					<p class="eyebrow"><?php esc_html_e( 'Keep reading', 'am-international' ); ?></p>
					<h2><?php esc_html_e( 'More from AM', 'am-international' ); ?></h2>
				</div>
				<div class="grid grid--3">
					<?php foreach ( $more as $item ) : ?>
						<?php am_card( $item, '', get_the_date( '', $item ) ); ?>
					<?php endforeach; ?>
				</div>
			</div>
		</section>
	<?php endif; ?>

	<?php
endwhile;

get_footer();
