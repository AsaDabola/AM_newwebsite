<?php
/**
 * Campus finder. Also used on the chapter archive, so it takes its heading
 * copy from the caller.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

$args = wp_parse_args(
	isset( $args ) ? $args : array(),
	array(
		'eyebrow' => __( 'Our network', 'am-international' ),
		'heading' => __( 'There may already be a fellowship on your campus.', 'am-international' ),
		'body'    => __( 'Search by school or city. If nothing comes up near you, that is an invitation — we will help you start one.', 'am-international' ),
		'cta_url' => '',
		'cta'     => __( 'Start a chapter', 'am-international' ),
	)
);

$chapters = get_posts( array(
	'post_type'      => 'am_chapter',
	'posts_per_page' => -1,
	'orderby'        => array( 'menu_order' => 'ASC', 'title' => 'ASC' ),
) );

if ( ! $chapters ) {
	return;
}
?>
<section class="section section--space">
	<div class="container">
		<div class="finder">
			<div data-reveal>
				<p class="eyebrow eyebrow--on-dark"><?php echo esc_html( $args['eyebrow'] ); ?></p>
				<h2><?php echo esc_html( $args['heading'] ); ?></h2>
				<p class="lede"><?php echo wp_kses_post( $args['body'] ); ?></p>
				<?php if ( $args['cta_url'] ) : ?>
					<div class="hero__actions" style="margin-top:2rem">
						<a class="btn" href="<?php echo esc_url( $args['cta_url'] ); ?>">
							<?php echo esc_html( $args['cta'] ); ?> <?php echo am_icon( 'arrow' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
						</a>
					</div>
				<?php endif; ?>
			</div>

			<div data-reveal>
				<form class="finder__form" role="search" onsubmit="return false">
					<div class="field">
						<span class="field__icon"><?php echo am_icon( 'search' ); // phpcs:ignore WordPress.Security.EscapeOutput ?></span>
						<label class="visually-hidden" for="chapter-search"><?php esc_html_e( 'Search the network', 'am-international' ); ?></label>
						<input id="chapter-search" type="search" placeholder="<?php esc_attr_e( 'Search school or city', 'am-international' ); ?>" data-chapter-search autocomplete="off">
					</div>
				</form>

				<ul class="chapter-list" data-chapter-list>
					<?php foreach ( $chapters as $chapter ) : ?>
						<?php $location = get_post_meta( $chapter->ID, '_am_location', true ); ?>
						<li>
							<a href="<?php echo esc_url( get_permalink( $chapter ) ); ?>">
								<span class="name"><?php echo esc_html( get_the_title( $chapter ) ); ?></span>
								<?php if ( $location ) : ?>
									<span class="place"><?php echo esc_html( $location ); ?></span>
								<?php endif; ?>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>

				<p class="chapter-list__empty" data-chapter-empty hidden>
					<?php esc_html_e( 'No chapters matched.', 'am-international' ); ?>
				</p>
			</div>
		</div>
	</div>
</section>
