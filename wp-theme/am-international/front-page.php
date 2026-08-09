<?php
/**
 * Homepage.
 *
 * Bands render in this order. Each one returns early when it has nothing to
 * show, so a fresh install degrades gracefully rather than printing empty
 * sections.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

get_header();

get_template_part( 'template-parts/home/hero' );
get_template_part( 'template-parts/home/quicklinks' );
?>

<?php if ( am_mod( 'prog_heading' ) || am_mod( 'prog_body' ) ) : ?>
	<?php
	$prog_btn_label = am_mod( 'prog_btn_label' );
	$prog_btn_url   = am_mod( 'prog_btn_url' );
	?>
	<section class="section section--sand">
		<div class="container">
			<div class="section-head section-head--center" data-reveal>
				<?php if ( am_mod( 'prog_eyebrow' ) ) : ?>
					<p class="eyebrow"><?php echo esc_html( am_mod( 'prog_eyebrow' ) ); ?></p>
				<?php endif; ?>
				<h2><?php echo esc_html( am_mod( 'prog_heading' ) ); ?></h2>
				<?php if ( am_mod( 'prog_body' ) ) : ?>
					<p class="lede"><?php echo wp_kses_post( am_mod( 'prog_body' ) ); ?></p>
				<?php endif; ?>
				<?php if ( $prog_btn_label && $prog_btn_url ) : ?>
					<p style="margin-top:2rem">
						<a class="btn btn--lg" href="<?php echo esc_url( $prog_btn_url ); ?>">
							<?php echo esc_html( $prog_btn_label ); ?> <?php echo am_icon( 'arrow' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
						</a>
					</p>
				<?php endif; ?>
			</div>
		</div>
	</section>
<?php endif; ?>

<?php get_template_part( 'template-parts/home/stages' ); ?>

<?php if ( am_mod( 'mission_quote' ) || am_mod( 'mission_quote_accent' ) ) : ?>
	<section class="section section--sand">
		<div class="container">
			<div class="mission">
				<div data-reveal>
					<?php if ( am_mod( 'mission_eyebrow' ) ) : ?>
						<p class="eyebrow"><?php echo esc_html( am_mod( 'mission_eyebrow' ) ); ?></p>
					<?php endif; ?>
					<p class="mission__quote">
						<?php echo wp_kses_post( am_mod( 'mission_quote' ) ); ?>
						<?php if ( am_mod( 'mission_quote_accent' ) ) : ?>
							<span class="accent"><?php echo esc_html( am_mod( 'mission_quote_accent' ) ); ?></span>
						<?php endif; ?>
						<?php echo wp_kses_post( am_mod( 'mission_quote_end' ) ); ?>
					</p>
					<?php if ( am_mod( 'mission_link' ) ) : ?>
						<?php am_link_arrow( am_mod( 'mission_link' ), am_mod( 'mission_link_label' ) ); ?>
					<?php endif; ?>
				</div>
				<div class="stack" data-reveal>
					<?php if ( am_mod( 'mission_side' ) ) : ?>
						<p class="lede"><?php echo wp_kses_post( am_mod( 'mission_side' ) ); ?></p>
					<?php endif; ?>
					<?php if ( am_mod( 'mission_side_body' ) ) : ?>
						<p><?php echo wp_kses_post( am_mod( 'mission_side_body' ) ); ?></p>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</section>
<?php endif; ?>

<?php get_template_part( 'template-parts/home/media' ); ?>

<?php
// Upcoming events, newest first, hiding anything already past.
$events = get_posts( array(
	'post_type'      => 'am_event',
	'posts_per_page' => 3,
	'meta_key'       => '_am_event_date',
	'orderby'        => 'meta_value',
	'order'          => 'ASC',
	'meta_query'     => array(
		'relation' => 'OR',
		array(
			'key'     => '_am_event_date',
			'value'   => gmdate( 'Y-m-d' ),
			'compare' => '>=',
			'type'    => 'DATE',
		),
		array(
			'key'     => '_am_event_date',
			'compare' => 'NOT EXISTS',
		),
	),
) );
?>
<?php if ( $events ) : ?>
	<section class="section">
		<div class="container">
			<div class="section-head section-head--split">
				<div data-reveal>
					<p class="eyebrow"><?php esc_html_e( 'Events', 'am-international' ); ?></p>
					<h2><?php esc_html_e( 'Where the network gathers.', 'am-international' ); ?></h2>
				</div>
				<div class="section-head__aside" data-reveal>
					<?php am_link_arrow( get_post_type_archive_link( 'am_event' ), __( 'All events', 'am-international' ) ); ?>
				</div>
			</div>
			<div class="events-row">
				<?php foreach ( $events as $event ) : ?>
					<?php
					$when = get_post_meta( $event->ID, '_am_event_when', true );
					$link = get_post_meta( $event->ID, '_am_event_link', true );
					?>
					<a class="event-chip" href="<?php echo esc_url( $link ? $link : get_permalink( $event ) ); ?>" data-reveal>
						<?php if ( $when ) : ?>
							<span><?php echo esc_html( $when ); ?></span>
						<?php endif; ?>
						<strong><?php echo esc_html( get_the_title( $event ) ); ?></strong>
					</a>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
<?php endif; ?>

<?php
get_template_part( 'template-parts/home/finder', null, array(
	'cta_url' => am_mod( 'stages_link' ),
) );
?>

<?php if ( am_mod( 'legacy_quote' ) ) : ?>
	<?php $legacy_image = am_mod( 'legacy_image' ); ?>
	<section class="section section--navy">
		<div class="container">
			<div class="legacy">
				<div class="legacy__portrait" data-reveal>
					<img
						src="<?php echo esc_url( $legacy_image ? $legacy_image : get_template_directory_uri() . '/assets/img/portrait-winter.svg' ); ?>"
						alt="<?php echo esc_attr( am_mod( 'legacy_cite' ) ); ?>"
						loading="lazy" width="640" height="800">
				</div>
				<div data-reveal>
					<?php if ( am_mod( 'legacy_eyebrow' ) ) : ?>
						<p class="eyebrow eyebrow--on-dark"><?php echo esc_html( am_mod( 'legacy_eyebrow' ) ); ?></p>
					<?php endif; ?>
					<blockquote>
						<?php echo wp_kses_post( am_mod( 'legacy_quote' ) ); ?>
						<?php if ( am_mod( 'legacy_cite' ) ) : ?>
							<cite><?php echo esc_html( am_mod( 'legacy_cite' ) ); ?></cite>
						<?php endif; ?>
					</blockquote>
					<?php if ( am_mod( 'legacy_body' ) ) : ?>
						<p class="lede" style="margin-top:1.5rem"><?php echo wp_kses_post( am_mod( 'legacy_body' ) ); ?></p>
					<?php endif; ?>
					<?php if ( am_mod( 'legacy_link' ) ) : ?>
						<?php am_link_arrow( am_mod( 'legacy_link' ), __( 'His legacy', 'am-international' ) ); ?>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</section>
<?php endif; ?>

<?php
get_footer();
