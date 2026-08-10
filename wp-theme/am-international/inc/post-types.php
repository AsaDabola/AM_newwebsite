<?php
/**
 * Custom content types: chapters, events and ministries.
 *
 * Chapters carry latitude/longitude, which feeds both the campus finder and
 * the markers on the homepage globe.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register the three directories AM maintains.
 */
function am_register_post_types() {
	register_post_type( 'am_chapter', array(
		'labels'        => array(
			'name'               => __( 'Chapters', 'am-international' ),
			'singular_name'      => __( 'Chapter', 'am-international' ),
			'add_new_item'       => __( 'Add New Chapter', 'am-international' ),
			'edit_item'          => __( 'Edit Chapter', 'am-international' ),
			'search_items'       => __( 'Search Chapters', 'am-international' ),
			'not_found'          => __( 'No chapters yet.', 'am-international' ),
			'menu_name'          => __( 'Chapters', 'am-international' ),
		),
		'public'        => true,
		'has_archive'   => 'network',
		'menu_icon'     => 'dashicons-location-alt',
		'menu_position' => 21,
		'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ),
		'rewrite'       => array( 'slug' => 'network' ),
		'show_in_rest'  => true,
	) );

	register_post_type( 'am_event', array(
		'labels'        => array(
			'name'          => __( 'Events', 'am-international' ),
			'singular_name' => __( 'Event', 'am-international' ),
			'add_new_item'  => __( 'Add New Event', 'am-international' ),
			'edit_item'     => __( 'Edit Event', 'am-international' ),
			'not_found'     => __( 'No events yet.', 'am-international' ),
			'menu_name'     => __( 'Events', 'am-international' ),
		),
		'public'        => true,
		'has_archive'   => 'events',
		'menu_icon'     => 'dashicons-calendar-alt',
		'menu_position' => 22,
		'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
		'rewrite'       => array( 'slug' => 'events' ),
		'show_in_rest'  => true,
	) );

	register_post_type( 'am_ministry', array(
		'labels'        => array(
			'name'          => __( 'Ministries', 'am-international' ),
			'singular_name' => __( 'Ministry', 'am-international' ),
			'add_new_item'  => __( 'Add New Ministry', 'am-international' ),
			'edit_item'     => __( 'Edit Ministry', 'am-international' ),
			'not_found'     => __( 'No ministries yet.', 'am-international' ),
			'menu_name'     => __( 'Ministries', 'am-international' ),
		),
		'public'        => true,
		'has_archive'   => 'ministries',
		'menu_icon'     => 'dashicons-groups',
		'menu_position' => 23,
		'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ),
		'rewrite'       => array( 'slug' => 'ministries' ),
		'show_in_rest'  => true,
	) );
}
add_action( 'init', 'am_register_post_types' );

/**
 * Meta fields, registered so they are available to the block editor and REST.
 */
function am_register_meta() {
	$string_field = array(
		'type'          => 'string',
		'single'        => true,
		'show_in_rest'  => true,
		'auth_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
	);

	register_post_meta( 'am_chapter', '_am_location', $string_field );
	register_post_meta( 'am_chapter', '_am_lat', $string_field );
	register_post_meta( 'am_chapter', '_am_lng', $string_field );
	register_post_meta( 'am_chapter', '_am_kind', $string_field );

	register_post_meta( 'am_event', '_am_event_when', $string_field );
	register_post_meta( 'am_event', '_am_event_date', $string_field );
	register_post_meta( 'am_event', '_am_event_link', $string_field );

	register_post_meta( 'am_ministry', '_am_ministry_tag', $string_field );
}
add_action( 'init', 'am_register_meta' );

/**
 * The meta boxes. Deliberately plain fields rather than a builder dependency.
 */
function am_add_meta_boxes() {
	add_meta_box(
		'am_chapter_details',
		__( 'Chapter details', 'am-international' ),
		'am_render_chapter_box',
		'am_chapter',
		'normal',
		'high'
	);

	add_meta_box(
		'am_event_details',
		__( 'Event details', 'am-international' ),
		'am_render_event_box',
		'am_event',
		'normal',
		'high'
	);

	add_meta_box(
		'am_ministry_details',
		__( 'Ministry details', 'am-international' ),
		'am_render_ministry_box',
		'am_ministry',
		'side',
		'default'
	);
}
add_action( 'add_meta_boxes', 'am_add_meta_boxes' );

/**
 * Small helper for a labelled text input inside a meta box.
 */
function am_meta_field( $post_id, $key, $label, $help = '', $type = 'text' ) {
	$value = get_post_meta( $post_id, $key, true );
	printf(
		'<p style="margin:0 0 1rem"><label for="%1$s" style="display:block;font-weight:600;margin-bottom:.25rem">%2$s</label>' .
		'<input type="%5$s" id="%1$s" name="%1$s" value="%3$s" class="widefat">%4$s</p>',
		esc_attr( $key ),
		esc_html( $label ),
		esc_attr( $value ),
		$help ? '<span class="description">' . esc_html( $help ) . '</span>' : '',
		esc_attr( $type )
	);
}

function am_render_chapter_box( $post ) {
	wp_nonce_field( 'am_save_meta', 'am_meta_nonce' );
	am_meta_field( $post->ID, '_am_location', __( 'City / state', 'am-international' ), __( 'Shown under the chapter name, e.g. "Cambridge, Massachusetts".', 'am-international' ) );
	am_meta_field( $post->ID, '_am_kind', __( 'Marker label', 'am-international' ), __( 'Shown on the globe tooltip, e.g. "Campus chapter" or "Headquarters".', 'am-international' ) );
	echo '<div style="display:flex;gap:1rem">';
	am_meta_field( $post->ID, '_am_lat', __( 'Latitude', 'am-international' ), __( 'e.g. 42.3736. Leave both blank to keep this chapter off the globe.', 'am-international' ) );
	am_meta_field( $post->ID, '_am_lng', __( 'Longitude', 'am-international' ), __( 'e.g. -71.1097. Negative is west.', 'am-international' ) );
	echo '</div>';
	echo '<p class="description">' . esc_html__( 'Tip: right-click a spot in Google Maps and the first entry on the menu is "latitude, longitude" - paste the two numbers here.', 'am-international' ) . '</p>';
}

function am_render_event_box( $post ) {
	wp_nonce_field( 'am_save_meta', 'am_meta_nonce' );
	am_meta_field( $post->ID, '_am_event_when', __( 'Display date', 'am-international' ), __( 'Free text as it should read, e.g. "April 4-5".', 'am-international' ) );
	am_meta_field( $post->ID, '_am_event_date', __( 'Sort date', 'am-international' ), __( 'Used to order events and hide past ones.', 'am-international' ), 'date' );
	am_meta_field( $post->ID, '_am_event_link', __( 'Registration link', 'am-international' ), __( 'Optional. Full URL.', 'am-international' ), 'url' );
}

function am_render_ministry_box( $post ) {
	wp_nonce_field( 'am_save_meta', 'am_meta_nonce' );
	am_meta_field( $post->ID, '_am_ministry_tag', __( 'Card label', 'am-international' ), __( 'Small tag on the card, e.g. "Fellowship".', 'am-international' ) );
}

/**
 * Persist the meta boxes.
 */
function am_save_meta( $post_id ) {
	if ( ! isset( $_POST['am_meta_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['am_meta_nonce'] ), 'am_save_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$fields = array(
		'_am_location'     => 'sanitize_text_field',
		'_am_kind'         => 'sanitize_text_field',
		'_am_lat'          => 'am_sanitize_coord',
		'_am_lng'          => 'am_sanitize_coord',
		'_am_event_when'   => 'sanitize_text_field',
		'_am_event_date'   => 'sanitize_text_field',
		'_am_event_link'   => 'esc_url_raw',
		'_am_ministry_tag' => 'sanitize_text_field',
	);

	foreach ( $fields as $key => $sanitizer ) {
		if ( ! isset( $_POST[ $key ] ) ) {
			continue;
		}
		$value = call_user_func( $sanitizer, wp_unslash( $_POST[ $key ] ) );
		if ( '' === $value ) {
			delete_post_meta( $post_id, $key );
		} else {
			update_post_meta( $post_id, $key, $value );
		}
	}
}
add_action( 'save_post', 'am_save_meta' );

/**
 * Coordinates must be numeric and within range, or they are discarded - a bad
 * value would otherwise put a marker somewhere meaningless on the globe.
 */
function am_sanitize_coord( $value ) {
	$value = trim( (string) $value );
	if ( '' === $value || ! is_numeric( $value ) ) {
		return '';
	}
	$number = (float) $value;
	if ( $number < -180 || $number > 180 ) {
		return '';
	}
	return (string) $number;
}

/**
 * Order chapter and ministry archives by menu order, then title.
 */
function am_archive_order( $query ) {
	if ( is_admin() || ! $query->is_main_query() ) {
		return;
	}

	if ( $query->is_post_type_archive( array( 'am_chapter', 'am_ministry' ) ) ) {
		$query->set( 'orderby', array( 'menu_order' => 'ASC', 'title' => 'ASC' ) );
		$query->set( 'posts_per_page', -1 );
	}

	if ( $query->is_post_type_archive( 'am_event' ) ) {
		$query->set( 'meta_key', '_am_event_date' );
		$query->set( 'orderby', 'meta_value' );
		$query->set( 'order', 'ASC' );
	}
}
add_action( 'pre_get_posts', 'am_archive_order' );
