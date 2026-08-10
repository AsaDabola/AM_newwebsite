<?php
/**
 * Media band: a feature player beside the most recent posts.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

$count = absint( am_mod( 'media_count' ) );
$count = $count ? $count : 4;

$posts = get_posts( array(
	'posts_per_page'      => $count,
	'ignore_sticky_posts' => true,
) );

if ( ! $posts ) {
	return;
}

$video  = am_mod( 'media_video' );
$poster = am_mod( 'media_poster' );
?>
<section class="section section--navy">
	<div class="container">
		<div class="section-head section-head--split">
			<div data-reveal>
				<?php if ( am_mod( 'media_eyebrow' ) ) : ?>
					<p class="eyebrow eyebrow--on-dark"><?php echo esc_html( am_mod( 'media_eyebrow' ) ); ?></p>
				<?php endif; ?>
				<h2><?php echo esc_html( am_mod( 'media_heading' ) ); ?></h2>
			</div>
			<div class="section-head__aside" data-reveal>
				<?php am_link_arrow( get_permalink( get_option( 'page_for_posts' ) ) ?: home_url( '/' ), __( 'More contents', 'am-international' ) ); ?>
			</div>
		</div>

		<div class="media">
			<div class="media__player" data-reveal>
				<?php if ( $video ) : ?>
					<?php
					// wp_oembed_get handles YouTube and Vimeo; anything else falls
					// through to a plain link so the section never breaks.
					$embed = wp_oembed_get( $video, array( 'width' => 1200 ) );
					if ( $embed ) {
						echo $embed; // phpcs:ignore WordPress.Security.EscapeOutput -- oEmbed output is sanitised by core.
					} else {
						printf(
							'<a href="%s" rel="noopener" target="_blank">%s</a>',
							esc_url( $video ),
							esc_html__( 'Watch the video', 'am-international' )
						);
					}
					?>
				<?php else : ?>
					<?php if ( $poster ) : ?>
						<img src="<?php echo esc_url( $poster ); ?>" alt="" loading="lazy" width="1200" height="800">
					<?php else : ?>
						<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/img/feature-chapters.svg' ); ?>" alt="" loading="lazy" width="1200" height="800">
					<?php endif; ?>
				<?php endif; ?>
			</div>

			<ul class="media__list" data-reveal>
				<?php foreach ( $posts as $post_item ) : ?>
					<li>
						<a href="<?php echo esc_url( get_permalink( $post_item ) ); ?>">
							<h3><?php echo esc_html( get_the_title( $post_item ) ); ?></h3>
							<time datetime="<?php echo esc_attr( get_the_date( 'c', $post_item ) ); ?>">
								<?php echo esc_html( get_the_date( '', $post_item ) ); ?>
							</time>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>
</section>
