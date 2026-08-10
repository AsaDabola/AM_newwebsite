<?php
/**
 * Reusable output helpers: icons, the logo lockup, cards and page headers.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

/**
 * Inline SVG icon set. Inline rather than a sprite so icons inherit colour and
 * need no extra request.
 *
 * @param string $name Icon key.
 * @return string SVG markup, or an empty string when the key is unknown.
 */
function am_icon( $name ) {
	$icons = array(
		'chevron' => '<svg class="nav__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
		'arrow'   => '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
		'search'  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
		'pin'     => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
		'heart'   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.6-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.4 12 20 12 20z"/></svg>',
		'users'   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3.2 3.2 0 0 1 0 5"/><path d="M18 20a6 6 0 0 0-2.4-4.8"/></svg>',
		'book'    => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H19v3H6.5"/></svg>',
		'globe'   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z"/></svg>',
		'send'    => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 3L10.5 13.5"/><path d="M21 3l-6.8 18-3.7-7.5L3 9.8z"/></svg>',
		'plus'    => '<svg class="accordion__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
		'play'    => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
		'facebook'  => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5h1.65V4.6c-.29-.04-1.27-.12-2.41-.12-2.39 0-4.03 1.46-4.03 4.14v2.31H7.5V14h2.76v8z"/></svg>',
		'instagram' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none"/></svg>',
		'youtube'   => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.75-1.75C18.35 5.15 12 5.15 12 5.15s-6.35 0-7.85.4A2.5 2.5 0 0 0 2.4 7.3C2 8.8 2 12 2 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.75 1.75c1.5.4 7.85.4 7.85.4s6.35 0 7.85-.4a2.5 2.5 0 0 0 1.75-1.75C22 15.2 22 12 22 12zM10 15.1V8.9l5.2 3.1z"/></svg>',
		'mail'      => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>',
	);

	return isset( $icons[ $name ] ) ? $icons[ $name ] : '';
}

/**
 * The AM / INTERNATIONAL lockup. Uses the Customizer logo when one is set,
 * otherwise falls back to the type-based reconstruction.
 */
function am_logo() {
	$home = esc_url( home_url( '/' ) );

	if ( has_custom_logo() ) {
		$id  = get_theme_mod( 'custom_logo' );
		$img = wp_get_attachment_image(
			$id,
			'full',
			false,
			array(
				'class' => 'logo__img',
				'alt'   => get_bloginfo( 'name' ),
			)
		);
		if ( $img ) {
			return '<a class="logo logo--img" href="' . $home . '" rel="home">' . $img . '</a>';
		}
	}

	return '<a class="logo" href="' . $home . '" rel="home">
      <span class="logo__text">
        <span class="logo__name">AM</span>
        <span class="logo__sub">International</span>
      </span>
    </a>';
}

/**
 * Does the current view draw the globe? Only the front page by default.
 */
function am_page_has_globe() {
	return (bool) apply_filters( 'am_page_has_globe', is_front_page() );
}

/**
 * Chapters that have usable coordinates, shaped for globe.js.
 *
 * The globe expects [name, label, latitude, longitude]. The first entry is
 * treated as home and the connecting arcs radiate from it, so a chapter whose
 * marker label mentions "headquarters" is floated to the front.
 *
 * @return array
 */
function am_get_globe_markers() {
	$chapters = get_posts( array(
		'post_type'      => 'am_chapter',
		'posts_per_page' => 100,
		'orderby'        => array( 'menu_order' => 'ASC', 'title' => 'ASC' ),
		'meta_query'     => array(
			array(
				'key'     => '_am_lat',
				'compare' => 'EXISTS',
			),
		),
	) );

	$markers = array();
	$home    = null;

	foreach ( $chapters as $chapter ) {
		$lat = get_post_meta( $chapter->ID, '_am_lat', true );
		$lng = get_post_meta( $chapter->ID, '_am_lng', true );

		// Both coordinates are required; one on its own is meaningless.
		if ( '' === $lat || '' === $lng ) {
			continue;
		}

		$kind  = get_post_meta( $chapter->ID, '_am_kind', true );
		$kind  = $kind ? $kind : __( 'Campus chapter', 'am-international' );
		$entry = array(
			get_the_title( $chapter ),
			$kind,
			(float) $lat,
			(float) $lng,
		);

		if ( null === $home && false !== stripos( $kind, 'headquarter' ) ) {
			$home = $entry;
		} else {
			$markers[] = $entry;
		}
	}

	if ( $home ) {
		array_unshift( $markers, $home );
	}

	return $markers;
}

/**
 * A card linking to a post. Falls back to placeholder artwork when no featured
 * image has been set, so the grid never shows a broken frame.
 *
 * @param int|WP_Post $post Post to render.
 * @param string      $tag  Optional label shown over the image.
 * @param string      $meta Optional small text under the excerpt.
 */
function am_card( $post = null, $tag = '', $meta = '' ) {
	$post = get_post( $post );
	if ( ! $post ) {
		return;
	}

	$permalink = get_permalink( $post );
	$title     = get_the_title( $post );
	$excerpt   = get_the_excerpt( $post );
	?>
	<a class="card" href="<?php echo esc_url( $permalink ); ?>" data-reveal>
		<div class="card__media">
			<?php am_thumbnail( $post, 'am-card', 'card' ); ?>
			<?php if ( $tag ) : ?>
				<span class="card__tag"><?php echo esc_html( $tag ); ?></span>
			<?php endif; ?>
		</div>
		<div class="card__body">
			<h3><?php echo esc_html( $title ); ?></h3>
			<?php if ( $excerpt ) : ?>
				<p><?php echo esc_html( $excerpt ); ?></p>
			<?php endif; ?>
			<?php if ( $meta ) : ?>
				<p class="card__meta"><?php echo esc_html( $meta ); ?></p>
			<?php endif; ?>
		</div>
	</a>
	<?php
}

/**
 * Featured image with a deterministic placeholder fallback.
 *
 * @param int|WP_Post $post  Post.
 * @param string      $size  Image size.
 * @param string      $shape One of card, feature, square, portrait.
 */
function am_thumbnail( $post, $size = 'am-card', $shape = 'card' ) {
	$post = get_post( $post );

	if ( $post && has_post_thumbnail( $post ) ) {
		echo get_the_post_thumbnail( $post, $size, array( 'loading' => 'lazy' ) );
		return;
	}

	// Rotate through the bundled artwork so neighbouring cards differ.
	$pool = array(
		'card'     => array( 'ministry-la-familia', 'ministry-athletics', 'ministry-business', 'ministry-academy', 'ministry-chinese', 'ministry-worship', 'story-1', 'story-2', 'story-3' ),
		'feature'  => array( 'feature-chapters', 'feature-academy', 'feature-easter-retreat' ),
		'square'   => array( 'person-1', 'person-2', 'person-3', 'person-4' ),
		'portrait' => array( 'portrait-winter' ),
	);

	$list  = isset( $pool[ $shape ] ) ? $pool[ $shape ] : $pool['card'];
	$index = $post ? ( absint( $post->ID ) % count( $list ) ) : 0;
	$file  = $list[ $index ];

	$dims = array(
		'card'     => array( 800, 500 ),
		'feature'  => array( 1200, 800 ),
		'square'   => array( 600, 600 ),
		'portrait' => array( 640, 800 ),
	);
	$size_pair = isset( $dims[ $shape ] ) ? $dims[ $shape ] : $dims['card'];

	printf(
		'<img src="%s" alt="" loading="lazy" width="%d" height="%d">',
		esc_url( get_template_directory_uri() . '/assets/img/' . $file . '.svg' ),
		(int) $size_pair[0],
		(int) $size_pair[1]
	);
}

/**
 * Dark page header used by every view except the front page.
 *
 * @param string $title  Heading.
 * @param string $lede   Optional standfirst.
 * @param array  $crumbs Array of [label, url]; url may be empty for the current page.
 */
function am_page_hero( $title, $lede = '', $crumbs = array() ) {
	?>
	<section class="page-hero">
		<div class="container">
			<?php if ( $crumbs ) : ?>
				<ol class="breadcrumb">
					<?php foreach ( $crumbs as $crumb ) : ?>
						<li>
							<?php if ( ! empty( $crumb[1] ) ) : ?>
								<a href="<?php echo esc_url( $crumb[1] ); ?>"><?php echo esc_html( $crumb[0] ); ?></a>
							<?php else : ?>
								<?php echo esc_html( $crumb[0] ); ?>
							<?php endif; ?>
						</li>
					<?php endforeach; ?>
				</ol>
			<?php endif; ?>
			<h1><?php echo wp_kses_post( $title ); ?></h1>
			<?php if ( $lede ) : ?>
				<p class="lede"><?php echo wp_kses_post( $lede ); ?></p>
			<?php endif; ?>
		</div>
	</section>
	<?php
}

/**
 * Breadcrumb trail starting at Home.
 *
 * @param array $extra Additional [label, url] pairs.
 * @return array
 */
function am_crumbs( $extra = array() ) {
	return array_merge(
		array( array( __( 'Home', 'am-international' ), home_url( '/' ) ) ),
		$extra
	);
}

/**
 * A "Read more" style link with the arrow icon.
 */
function am_link_arrow( $url, $label ) {
	printf(
		'<a class="link-arrow" href="%s">%s %s</a>',
		esc_url( $url ),
		esc_html( $label ),
		am_icon( 'arrow' )
	);
}
