<?php
/**
 * Offline preview harness for the AM International theme.
 *
 * WordPress cannot be installed in every environment (it needs MySQL, and a
 * download), but the templates still need checking. This file implements just
 * enough of the WordPress API - including a faithful Walker traversal - to
 * render the theme's templates to static HTML with sample content.
 *
 * It proves the templates parse, call only functions that exist, and produce
 * the expected markup. It is NOT a substitute for testing on a real install:
 * it does not exercise the database, rewrite rules, the block editor or the
 * Customizer UI.
 *
 * Usage:
 *   php wp-theme/render-preview.php            # writes wp-theme/preview/
 *   php wp-theme/render-preview.php --check     # exit 1 if any assertion fails
 *
 * @package AM_International
 */

define( 'ABSPATH', __DIR__ . '/' );
define( 'THEME_DIR', __DIR__ . '/am-international' );

$GLOBALS['am_actions'] = array();
$GLOBALS['am_errors']  = array();

/* ------------------------------------------------------------ sample data -- */

$GLOBALS['am_posts'] = array();
$next_id             = 1;

/**
 * Registers a fake post and returns its id.
 */
function seed_post( $type, $title, $excerpt = '', $meta = array(), $content = '<p>Sample body copy.</p>' ) {
	global $am_posts, $next_id;
	$id                = $next_id++;
	$am_posts[ $id ]   = (object) array(
		'ID'           => $id,
		'post_type'    => $type,
		'post_title'   => $title,
		'post_excerpt' => $excerpt,
		'post_content' => $content,
		'post_status'  => 'publish',
		'post_parent'  => 0,
		'menu_order'   => $id,
		'meta'         => $meta,
		'date'         => '2026-01-0' . ( ( $id % 9 ) + 1 ),
	);
	return $id;
}

$stage_ids = array(
	seed_post( 'page', 'Connect with AM', 'AM offers various Bible study programs that nurture our spiritual life and relationship with the Lord Jesus Christ.' ),
	seed_post( 'page', 'Grow with AM', 'Join our Group Activities and mature together in the fellowship of truth.' ),
	seed_post( 'page', 'Lead with AM', 'AM is happy to welcome students interested in volunteering and serving through their God given talents.' ),
	seed_post( 'page', 'Sent with AM', 'AM will continue to walk with you until your calling of being sent is fulfilled.' ),
);

seed_post( 'post', 'Four Spiritual Themes – Overview', 'An overview of the four themes that shape AM teaching.' );
seed_post( 'post', 'What is Salvation? | Sola Fide Part 1', 'The first part of the Sola Fide series from AM Academy.' );
seed_post( 'post', 'Era of Social Media Discipleship', 'Connecting students to the reality of the Gospel online.' );
seed_post( 'post', 'God’s Promises For the New Year', 'A word for the year ahead.' );

seed_post( 'am_chapter', 'AM Harvard', 'The AM fellowship at Harvard.', array(
	'_am_location' => 'Cambridge, Massachusetts',
	'_am_lat'      => '42.3736',
	'_am_lng'      => '-71.1097',
	'_am_kind'     => 'Campus chapter',
) );
seed_post( 'am_chapter', 'AM Headquarters', 'The AM office.', array(
	'_am_location' => 'Trenton, New Jersey',
	'_am_lat'      => '40.2206',
	'_am_lng'      => '-74.7597',
	'_am_kind'     => 'Headquarters',
) );
seed_post( 'am_chapter', 'AM @ UCLA', 'The AM fellowship at UCLA.', array(
	'_am_location' => 'Los Angeles, California',
	'_am_lat'      => '34.0522',
	'_am_lng'      => '-118.2437',
	'_am_kind'     => 'Campus chapter',
) );
// A chapter with no coordinates, to check it is skipped on the globe.
seed_post( 'am_chapter', 'AM Rutgers', 'The AM fellowship at Rutgers.', array(
	'_am_location' => 'New Brunswick, New Jersey',
) );

seed_post( 'am_event', 'Easter Retreat', 'Teaching, worship and sending.', array(
	'_am_event_when' => 'April 4–5',
	'_am_event_date' => '2099-04-04',
) );
seed_post( 'am_event', 'Lenten 40-Day Walk', 'Forty days of prayer.', array(
	'_am_event_when' => 'February 18',
	'_am_event_date' => '2099-02-18',
) );
seed_post( 'am_event', 'New Chapter Leaders’ Meeting', 'For incoming chapter leaders.', array(
	'_am_event_when' => 'January 16',
	'_am_event_date' => '2099-01-16',
) );

seed_post( 'am_ministry', 'La Familia', 'A Latino student fellowship.', array( '_am_ministry_tag' => 'Fellowship' ) );
seed_post( 'am_ministry', 'AM Athletics', 'For anyone into sport and the love of Jesus.', array( '_am_ministry_tag' => 'Fellowship' ) );
seed_post( 'am_ministry', 'AM Business Fellowship', 'For the business leaders of tomorrow.', array( '_am_ministry_tag' => 'Fellowship' ) );

/* Menus: [title, url, parent_index, description, classes] */
$GLOBALS['am_menus'] = array(
	'primary' => array(
		array( 'Who We Are', '/about/', -1, 'Dr. Ralph D. Winter served as AM’s first honorary chairman.', array() ),
		array( 'The ministry', '#', 0, '', array() ),
		array( 'Who we are', '/about/', 1, '', array() ),
		array( 'Mission statement', '/about/mission/', 1, '', array() ),
		array( 'Statement of faith', '/about/beliefs/', 1, '', array() ),
		array( 'People', '#', 0, '', array() ),
		array( 'Leadership & staff', '/about/leadership/', 5, '', array() ),
		array( 'Legacy of Ralph D. Winter', '/about/legacy/', 5, '', array() ),

		array( 'What We Do', '/what-we-do/', -1, 'An online discipleship and Bible education program.', array() ),
		array( 'Study', '#', 8, '', array() ),
		array( 'Bible Study Program', '/what-we-do/bible-study/', 9, '', array() ),
		array( 'AM Academy', '/academy/', 9, '', array() ),

		array( 'Get Involved', '/get-involved/', -1, '', array() ),
		array( 'Four ways in', '#', 12, '', array() ),
		array( 'Connect with AM', '/get-involved/#connect', 13, '', array() ),
		array( 'Grow with AM', '/get-involved/#grow', 13, '', array() ),

		array( 'Our Network', '/network/', -1, '', array() ),
		array( 'News', '/news/', -1, '', array() ),
		array( 'Contact Us', '/contact/', -1, '', array() ),
	),
	'utility' => array(
		array( 'Our Network', '/network/', -1, '', array() ),
		array( 'AM Academy', '/academy/', -1, '', array() ),
		array( 'News', '/news/', -1, '', array() ),
		array( 'Contact Us', '/contact/', -1, '', array() ),
	),
	'quicklinks' => array(
		array( 'Join a Bible study', '/what-we-do/bible-study/', -1, 'The 5-phase online discipleship and Bible education program.', array( 'am-icon-book' ) ),
		array( 'Find your campus', '/network/', -1, 'Our network of chapters and fellowships.', array( 'am-icon-pin' ) ),
		array( 'Get involved', '/get-involved/', -1, 'Connect, grow, lead and be sent with AM.', array( 'am-icon-users' ) ),
		array( 'Support the mission', '/give/', -1, 'Give, pray and partner with students in the field.', array( 'am-icon-heart' ) ),
	),
	'footer_1' => array(
		array( 'About AM', '/about/', -1, '', array() ),
		array( 'Mission statement', '/about/mission/', -1, '', array() ),
		array( 'Our history', '/about/history/', -1, '', array() ),
	),
	'footer_2' => array(
		array( 'Bible Study Program', '/what-we-do/bible-study/', -1, '', array() ),
		array( 'AM Academy', '/academy/', -1, '', array() ),
		array( 'Ministries', '/ministries/', -1, '', array() ),
	),
	'footer_3' => array(
		array( 'Our Network', '/network/', -1, '', array() ),
		array( 'Events', '/events/', -1, '', array() ),
		array( 'Give', '/give/', -1, '', array() ),
	),
	'footer_4' => array(
		array( 'News', '/news/', -1, '', array() ),
		array( 'Contact us', '/contact/', -1, '', array() ),
	),
	'legal' => array(
		array( 'Statement of faith', '/about/beliefs/', -1, '', array() ),
		array( 'Contact', '/contact/', -1, '', array() ),
	),
);

/* Theme mods that the harness pretends the site owner has saved. */
$GLOBALS['am_mods'] = array(
	'am_hero_btn1_url'   => '/what-we-do/bible-study/',
	'am_hero_btn2_url'   => '/about/',
	'am_prog_btn_url'    => '/what-we-do/bible-study/',
	'am_stages_link'     => '/get-involved/',
	'am_mission_link'    => '/about/mission/',
	'am_legacy_link'     => '/about/legacy/',
	'am_cta_btn1_url'    => '/give/',
	'am_cta_btn2_url'    => '/contact/',
	'am_header_cta_url'  => '/give/',
	'am_social_facebook' => 'https://facebook.com/example',
	'am_social_youtube'  => 'https://youtube.com/@example',
	'am_stage_1'         => $stage_ids[0],
	'am_stage_2'         => $stage_ids[1],
	'am_stage_3'         => $stage_ids[2],
	'am_stage_4'         => $stage_ids[3],
);

/* ------------------------------------------------------- WordPress stubs -- */

/**
 * Faithful enough reimplementation of WP's Walker traversal: start_el, then
 * children wrapped in start_lvl/end_lvl at the PARENT's depth, then end_el.
 */
class Walker {
	public $tree_type = '';
	public $db_fields = array();

	public function start_lvl( &$output, $depth = 0, $args = null ) {}
	public function end_lvl( &$output, $depth = 0, $args = null ) {}
	public function start_el( &$output, $object, $depth = 0, $args = null, $current_object_id = 0 ) {}
	public function end_el( &$output, $object, $depth = 0, $args = null ) {}

	public function walk( $elements, $max_depth = 0, ...$args ) {
		$output   = '';
		$children = array();
		$top      = array();

		foreach ( $elements as $element ) {
			if ( $element->menu_item_parent ) {
				$children[ $element->menu_item_parent ][] = $element;
			} else {
				$top[] = $element;
			}
		}

		foreach ( $top as $element ) {
			$this->display_element( $element, $children, $max_depth, 0, $args, $output );
		}
		return $output;
	}

	public function display_element( $element, &$children, $max_depth, $depth, $args, &$output ) {
		$id       = $element->ID;
		$has_kids = ! empty( $children[ $id ] );
		$arg      = isset( $args[0] ) ? $args[0] : null;

		$this->start_el( $output, $element, $depth, $arg, $id );

		if ( $has_kids && ( 0 === $max_depth || $max_depth > $depth + 1 ) ) {
			$this->start_lvl( $output, $depth, $arg );
			foreach ( $children[ $id ] as $child ) {
				$this->display_element( $child, $children, $max_depth, $depth + 1, $args, $output );
			}
			$this->end_lvl( $output, $depth, $arg );
		}

		$this->end_el( $output, $element, $depth, $arg );
	}
}

class Walker_Nav_Menu extends Walker {}

/* --- escaping / i18n --- */
function esc_html( $t ) { return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' ); }
function esc_attr( $t ) { return esc_html( $t ); }
function esc_url( $u ) { return htmlspecialchars( (string) $u, ENT_QUOTES, 'UTF-8' ); }
function esc_url_raw( $u ) { return (string) $u; }
function esc_textarea( $t ) { return esc_html( $t ); }
function wp_kses_post( $t ) { return (string) $t; }
function wp_strip_all_tags( $t ) { return strip_tags( (string) $t ); }
function sanitize_text_field( $t ) { return trim( strip_tags( (string) $t ) ); }
function sanitize_key( $t ) { return strtolower( preg_replace( '/[^a-z0-9_\-]/i', '', (string) $t ) ); }
function absint( $n ) { return abs( (int) $n ); }
function __( $t, $d = null ) { return $t; }
function _e( $t, $d = null ) { echo $t; }
function esc_html__( $t, $d = null ) { return esc_html( $t ); }
function esc_html_e( $t, $d = null ) { echo esc_html( $t ); }
function esc_attr_e( $t, $d = null ) { echo esc_attr( $t ); }
function esc_attr__( $t, $d = null ) { return esc_attr( $t ); }
function _x( $t, $c, $d = null ) { return $t; }
function nl2br_esc( $t ) { return nl2br( esc_html( $t ) ); }

/* --- hooks --- */
function add_action( $hook, $cb, $priority = 10, $args = 1 ) { $GLOBALS['am_actions'][ $hook ][] = $cb; }
function add_filter( $hook, $cb, $priority = 10, $args = 1 ) { $GLOBALS['am_actions'][ $hook ][] = $cb; }
function remove_action( $hook, $cb, $priority = 10 ) {}
function remove_filter( $hook, $cb, $priority = 10 ) {}
function do_action( $hook, ...$a ) {
	foreach ( $GLOBALS['am_actions'][ $hook ] ?? array() as $cb ) { call_user_func_array( $cb, $a ); }
}
function apply_filters( $hook, $value, ...$a ) { return $value; }
function add_theme_support( ...$a ) {}
function remove_theme_support( ...$a ) {}
function remove_post_type_support( ...$a ) {}
function add_post_type_support( ...$a ) {}
function add_image_size( ...$a ) {}
function register_nav_menus( $m ) { $GLOBALS['am_locations'] = $m; }
function register_sidebar( $a ) {}
function register_post_type( $t, $a ) { $GLOBALS['am_types'][ $t ] = $a; }
function register_post_meta( ...$a ) {}
function add_meta_box( ...$a ) {}
function load_theme_textdomain( ...$a ) {}
function flush_rewrite_rules( ...$a ) {}
function wp_nonce_field( ...$a ) {}
function wp_verify_nonce( ...$a ) { return true; }
function current_user_can( $c ) { return false; }
function is_admin() { return false; }
function wp_parse_args( $a, $d ) { return array_merge( $d, is_array( $a ) ? $a : array() ); }
function wp_json_encode( $v ) { return json_encode( $v ); }

/* --- theme paths --- */
function get_template_directory() { return THEME_DIR; }
function get_stylesheet_directory() { return THEME_DIR; }
function get_template_directory_uri() { return 'am-international'; }
function get_stylesheet_uri() { return 'am-international/style.css'; }
function home_url( $p = '/' ) { return $p === '/' ? 'index.html' : $p; }
function admin_url( $p = '' ) { return '#admin'; }
function bloginfo( $k ) { echo get_bloginfo( $k ); }
function get_bloginfo( $k ) {
	return 'name' === $k ? 'Apostolos Missions International' : ( 'charset' === $k ? 'UTF-8' : '' );
}
function wp_get_theme() { return new class { public function get( $k ) { return '1.0.0'; } }; }
function language_attributes() { echo 'lang="en"'; }
function body_class( $c = '' ) { echo 'class="' . esc_attr( implode( ' ', apply_filters( 'body_class', array( 'am-preview' ) ) ) ) . '"'; }
function get_search_form() { include THEME_DIR . '/searchform.php'; }

/* --- enqueue: record, then emit real tags so the preview is styled --- */
$GLOBALS['am_styles'] = array();
$GLOBALS['am_scripts'] = array();
$GLOBALS['am_inline'] = array();
function wp_enqueue_style( $h, $src = '', $d = array(), $v = '' ) { $GLOBALS['am_styles'][ $h ] = $src; }
function wp_enqueue_script( $h, $src = '', $d = array(), $v = '', $f = false ) { $GLOBALS['am_scripts'][ $h ] = $src; }
function wp_add_inline_script( $h, $code, $pos = 'after' ) { $GLOBALS['am_inline'][] = $code; }
function add_editor_style( $s ) {}
function filemtime_safe( $f ) { return file_exists( $f ) ? filemtime( $f ) : 1; }

function wp_head() {
	do_action( 'wp_enqueue_scripts' );
	do_action( 'wp_head' );
	echo "<title>" . esc_html( get_bloginfo( 'name' ) ) . "</title>\n";
	foreach ( $GLOBALS['am_styles'] as $src ) {
		echo '<link rel="stylesheet" href="' . esc_url( $src ) . '">' . "\n";
	}
}
function wp_footer() {
	foreach ( $GLOBALS['am_inline'] as $code ) {
		echo '<script>' . $code . "</script>\n";
	}
	foreach ( $GLOBALS['am_scripts'] as $src ) {
		echo '<script src="' . esc_url( $src ) . '" defer></script>' . "\n";
	}
}
function wp_body_open() {}
function wp_enqueue_scripts_noop() {}

/* --- template loading --- */
function get_header() { include THEME_DIR . '/header.php'; }
function get_footer() { include THEME_DIR . '/footer.php'; }
function get_template_part( $slug, $name = null, $args = array() ) {
	$file = THEME_DIR . '/' . $slug . ( $name ? "-$name" : '' ) . '.php';
	if ( file_exists( $file ) ) {
		include $file;
	} else {
		$GLOBALS['am_errors'][] = "missing template part: $slug";
	}
}

/* --- posts --- */
function get_post( $p = null ) {
	global $am_posts, $am_current;
	if ( is_object( $p ) ) { return $p; }
	if ( is_numeric( $p ) ) { return $am_posts[ $p ] ?? null; }
	return $am_current ?? null;
}
function get_post_status( $p ) { $o = get_post( $p ); return $o ? $o->post_status : false; }
function get_post_type( $p = null ) { $o = get_post( $p ); return $o ? $o->post_type : ''; }
function get_the_title( $p = null ) { $o = get_post( $p ); return $o ? $o->post_title : ''; }
function get_the_excerpt( $p = null ) { $o = get_post( $p ); return $o ? $o->post_excerpt : ''; }
function get_permalink( $p = null ) { $o = get_post( $p ); return $o ? '#post-' . $o->ID : '#'; }
function get_post_meta( $id, $key, $single = false ) {
	$o = get_post( $id );
	return $o && isset( $o->meta[ $key ] ) ? $o->meta[ $key ] : '';
}
function get_the_date( $f = '', $p = null ) { $o = get_post( $p ); return $o ? $o->date : ''; }
function has_post_thumbnail( $p = null ) { return false; }
function get_the_post_thumbnail( $p = null, $s = '', $a = array() ) { return ''; }
function the_post_thumbnail( $s = '', $a = array() ) {}
function get_posts( $args = array() ) {
	global $am_posts;
	$type  = $args['post_type'] ?? 'post';
	$limit = $args['posts_per_page'] ?? 5;
	$out   = array();
	foreach ( $am_posts as $p ) {
		if ( $p->post_type !== $type ) { continue; }
		if ( ! empty( $args['post__not_in'] ) && in_array( $p->ID, $args['post__not_in'], true ) ) { continue; }
		// Honour the "must have a latitude" filter used by the globe.
		if ( isset( $args['meta_query'][0]['key'] ) && 'EXISTS' === ( $args['meta_query'][0]['compare'] ?? '' ) ) {
			if ( empty( $p->meta[ $args['meta_query'][0]['key'] ] ) ) { continue; }
		}
		$out[] = $p;
	}
	if ( $limit > 0 ) { $out = array_slice( $out, 0, $limit ); }
	return $out;
}
function get_option( $k ) { return 0; }
function get_post_type_archive_link( $t ) { return '#archive-' . $t; }
function get_post_type_object( $t ) {
	$names = array( 'am_chapter' => 'Chapters', 'am_event' => 'Events', 'am_ministry' => 'Ministries' );
	return (object) array( 'labels' => (object) array( 'name' => $names[ $t ] ?? 'Posts' ) );
}
function post_type_archive_title( $p = '', $display = true ) {
	$t = get_post_type_object( $GLOBALS['am_archive_type'] ?? 'am_chapter' )->labels->name;
	if ( $display ) { echo esc_html( $t ); }
	return $t;
}
function wp_get_post_parent_id( $id ) { return 0; }
function am_set_loop( $posts ) { $GLOBALS['am_loop'] = array_values( $posts ); $GLOBALS['am_loop_i'] = -1; }
function have_posts() {
	return isset( $GLOBALS['am_loop'] ) && ( $GLOBALS['am_loop_i'] + 1 ) < count( $GLOBALS['am_loop'] );
}
function the_post() {
	$GLOBALS['am_loop_i']++;
	$GLOBALS['am_current'] = $GLOBALS['am_loop'][ $GLOBALS['am_loop_i'] ];
}
function get_the_ID() { $o = get_post(); return $o ? $o->ID : 0; }
function the_content() { $o = get_post(); echo $o ? $o->post_content : ''; }
function wp_link_pages( $a = array() ) {}
function the_posts_pagination( $a = array() ) {}
function is_front_page() { return ( $GLOBALS['am_view'] ?? '' ) === 'front'; }
function is_home() { return false; }
function is_archive() { return false; }
function is_search() { return false; }
function is_singular() { return false; }
function comments_open() { return false; }
function is_active_sidebar( $s ) { return false; }
function dynamic_sidebar( $s ) {}
function wp_oembed_get( $u, $a = array() ) { return ''; }

/* --- menus --- */
function has_nav_menu( $loc ) { return isset( $GLOBALS['am_menus'][ $loc ] ); }
function get_nav_menu_locations() {
	$out = array();
	foreach ( array_keys( $GLOBALS['am_menus'] ) as $i => $loc ) { $out[ $loc ] = $i + 1; }
	return $out;
}
function wp_get_nav_menu_object( $id ) {
	$names = array( 1 => 'Primary', 2 => 'Utility', 3 => 'Quick links', 4 => 'Who we are', 5 => 'What we do', 6 => 'Get involved', 7 => 'Media' );
	return (object) array( 'name' => $names[ $id ] ?? 'Menu' );
}
function am_build_menu_items( $loc ) {
	$rows  = $GLOBALS['am_menus'][ $loc ] ?? array();
	$items = array();
	foreach ( $rows as $i => $row ) {
		list( $title, $url, $parent, $description, $classes ) = $row;
		$items[ $i ] = (object) array(
			'ID'               => 1000 + $i,
			'title'            => $title,
			'url'              => $url,
			'description'      => $description,
			'attr_title'       => '',
			'classes'          => $classes,
			'menu_item_parent' => $parent >= 0 ? 1000 + $parent : 0,
		);
	}
	// Flag parents, the way WordPress does.
	foreach ( $items as $item ) {
		if ( $item->menu_item_parent ) {
			foreach ( $items as $maybe ) {
				if ( $maybe->ID === $item->menu_item_parent ) {
					$maybe->classes[] = 'menu-item-has-children';
				}
			}
		}
	}
	foreach ( $items as $item ) { $item->classes = array_unique( $item->classes ); }
	return array_values( $items );
}
function wp_get_nav_menu_items( $id ) {
	$locs = array_flip( get_nav_menu_locations() );
	return am_build_menu_items( $locs[ $id ] ?? 'primary' );
}
function wp_nav_menu( $args ) {
	$items  = am_build_menu_items( $args['theme_location'] );
	$walker = $args['walker'] ?? null;
	$depth  = $args['depth'] ?? 0;

	if ( $walker ) {
		echo $walker->walk( $items, $depth, $args );
		return;
	}

	$class = isset( $args['menu_class'] ) ? ' class="' . esc_attr( $args['menu_class'] ) . '"' : '';
	echo "<ul$class>";
	foreach ( $items as $item ) {
		if ( $item->menu_item_parent ) { continue; }
		echo '<li><a href="' . esc_url( $item->url ) . '">' . esc_html( $item->title ) . '</a></li>';
	}
	echo '</ul>';
}

/* --- search / archive titles --- */
function get_search_query( $escaped = true ) { return ''; }
function get_the_archive_title() { return 'Archive'; }
function get_the_archive_description() { return ''; }

/* --- theme mods --- */
function get_theme_mod( $k, $default = '' ) { return $GLOBALS['am_mods'][ $k ] ?? $default; }
function has_custom_logo() { return false; }
function wp_get_attachment_image( ...$a ) { return ''; }
function set_theme_mod( $k, $v ) { $GLOBALS['am_mods'][ $k ] = $v; }

/* ------------------------------------------------------------- run the theme */

require THEME_DIR . '/functions.php';

do_action( 'after_setup_theme' );
do_action( 'init' );

/**
 * Renders one template to a string.
 */
function render( $template, $view = '', $archive_type = '' ) {
	$GLOBALS['am_view']         = $view;
	$GLOBALS['am_archive_type'] = $archive_type;
	// Archive templates run the main loop, so prime it with matching posts.
	am_set_loop( $archive_type ? get_posts( array( 'post_type' => $archive_type, 'posts_per_page' => -1 ) ) : array() );
	$GLOBALS['am_styles']       = array();
	$GLOBALS['am_scripts']      = array();
	$GLOBALS['am_inline']       = array();

	ob_start();
	include THEME_DIR . '/' . $template;
	return ob_get_clean();
}

$out_dir = __DIR__ . '/preview';
if ( ! is_dir( $out_dir ) ) { mkdir( $out_dir, 0777, true ); }

$targets = array(
	'index.html'      => array( 'front-page.php', 'front' ),
	'network.html'    => array( 'archive-am_chapter.php', '', 'am_chapter' ),
	'ministries.html' => array( 'archive-am_ministry.php', '', 'am_ministry' ),
	'notfound.html'   => array( '404.php', '' ),
);

$results = array();
foreach ( $targets as $file => $spec ) {
	$html = render( $spec[0], $spec[1] ?? '', $spec[2] ?? '' );
	// Rewrite theme URIs so the preview finds the assets on disk.
	$html = str_replace( '"am-international/', '"../am-international/', $html );
	file_put_contents( "$out_dir/$file", $html );
	$results[ $file ] = $html;
}

/* ------------------------------------------------------------- assertions -- */

$checks = array();
$home   = $results['index.html'];

$checks['hero headline renders']        = str_contains( $home, 'Future Begins from' );
$checks['globe canvas present']         = str_contains( $home, 'class="globe__canvas"' );
$checks['globe markers injected']       = str_contains( $home, 'AM_GLOBE_MARKERS' );
$checks['HQ is first globe marker']     = (bool) preg_match( '/AM_GLOBE_MARKERS = \[\["AM Headquarters"/', $home );
$checks['chapter without coords skipped']= ! str_contains( substr( $home, strpos( $home, 'AM_GLOBE_MARKERS' ), 400 ), 'AM Rutgers' );
$checks['mega menu button rendered']    = str_contains( $home, 'nav__item--has-menu' );
$checks['mega menu columns rendered']   = str_contains( $home, 'megamenu__title' );
$checks['mega menu feature panel']      = str_contains( $home, 'megamenu__feature' );
$checks['top-level link without kids']  = (bool) preg_match( '/<li class="nav__item"><a class="nav__link" href="\/network\/"/', $home );
$checks['drawer rendered']              = str_contains( $home, 'class="drawer__group"' );
$checks['quick links rendered']         = substr_count( $home, 'class="quicklink"' ) === 4;
$checks['stage cards rendered']         = substr_count( $home, 'class="card__tag">Connect' ) === 1;
$checks['media list rendered']          = str_contains( $home, 'class="media__list"' );
$checks['events row rendered']          = str_contains( $home, 'class="event-chip"' );
$checks['chapter finder rendered']      = str_contains( $home, 'data-chapter-list' );
$checks['legacy band rendered']         = str_contains( $home, 'class="legacy"' );
$checks['cta band rendered']            = str_contains( $home, 'class="cta-band"' );
$checks['footer columns rendered']      = str_contains( $home, 'class="footer__col"' );
$checks['stylesheet enqueued']          = str_contains( $home, 'assets/css/main.css' );
$checks['globe script enqueued']        = str_contains( $home, 'assets/js/globe.js' );
$checks['no unresolved template parts'] = empty( $GLOBALS['am_errors'] );

// Tag balance: every opened <li>/<div> in the mega menu must close.
$count_tag = function ( $html, $tag ) {
	return preg_match_all( '/<' . $tag . '(?:\s[^>]*)?>/i', $html );
};
$checks['balanced div tags'] = $count_tag( $home, 'div' ) === substr_count( $home, '</div>' );
$checks['balanced li tags']  = $count_tag( $home, 'li' ) === substr_count( $home, '</li>' );
$checks['balanced ul tags']  = $count_tag( $home, 'ul' ) === substr_count( $home, '</ul>' );
$checks['balanced section tags'] = $count_tag( $home, 'section' ) === substr_count( $home, '</section>' );

$checks['network page renders finder']  = str_contains( $results['network.html'], 'data-chapter-list' );
$checks['ministries archive has cards'] = str_contains( $results['ministries.html'], 'class="card__tag">Fellowship' );
$checks['404 renders']                  = str_contains( $results['notfound.html'], 'went on mission' );

$failed = 0;
foreach ( $checks as $name => $ok ) {
	printf( "%s  %s\n", $ok ? 'PASS' : 'FAIL', $name );
	if ( ! $ok ) { $failed++; }
}

if ( $GLOBALS['am_errors'] ) {
	echo "\nErrors:\n - " . implode( "\n - ", $GLOBALS['am_errors'] ) . "\n";
}

printf( "\n%d checks, %d failed. Preview written to wp-theme/preview/\n", count( $checks ), $failed );
exit( $failed > 0 ? 1 : 0 );
