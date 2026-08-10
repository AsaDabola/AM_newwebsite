<?php
/**
 * Customizer settings.
 *
 * Everything on the homepage that is copy rather than content lives here, so
 * staff can edit it under Appearance -> Customize without touching templates.
 * Content that belongs in the CMS proper (news, events, chapters, ministries)
 * is pulled from posts instead.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

/**
 * Reads a theme mod, falling back to the default declared in am_settings().
 *
 * @param string $key Setting key without the am_ prefix.
 * @return mixed
 */
function am_mod( $key ) {
	$settings = am_settings();
	$default  = isset( $settings[ $key ]['default'] ) ? $settings[ $key ]['default'] : '';
	return get_theme_mod( 'am_' . $key, $default );
}

/**
 * The full settings map: key => [section, label, type, default, description].
 *
 * type is one of text, textarea, url, page, image, number.
 *
 * @return array
 */
function am_settings() {
	static $settings = null;
	if ( null !== $settings ) {
		return $settings;
	}

	$settings = array(

		/* ---- hero ---- */
		'home_force_template' => array( 'hero', __( 'Use the AM homepage design', 'am-international' ), 'checkbox', 1, __( 'Keep this on so the theme\'s homepage wins over a page builder. Turn it off if you would rather Elementor (or another builder) control the front page.', 'am-international' ) ),
		'hero_eyebrow'      => array( 'hero', __( 'Eyebrow', 'am-international' ), 'text', 'Apostolos — one who is sent' ),
		'hero_title'        => array( 'hero', __( 'Headline (plain part)', 'am-international' ), 'text', 'Future Begins from' ),
		'hero_title_accent' => array( 'hero', __( 'Headline (highlighted part)', 'am-international' ), 'text', 'Where We Are' ),
		'hero_lede'         => array( 'hero', __( 'Standfirst', 'am-international' ), 'textarea', 'Apostolos Missions International is an interdenominational ministry committed to spreading the gospel to the ends of the earth — a worldwide community of believers mobilising campus mission from Trenton, New Jersey outward.' ),
		'hero_btn1_label'   => array( 'hero', __( 'Primary button label', 'am-international' ), 'text', 'Join our Bible Study' ),
		'hero_btn1_url'     => array( 'hero', __( 'Primary button link', 'am-international' ), 'url', '' ),
		'hero_btn2_label'   => array( 'hero', __( 'Secondary button label', 'am-international' ), 'text', 'Who we are' ),
		'hero_btn2_url'     => array( 'hero', __( 'Secondary button link', 'am-international' ), 'url', '' ),
		'hero_stat1_value'  => array( 'hero', __( 'Stat 1 figure', 'am-international' ), 'text', '2003' ),
		'hero_stat1_label'  => array( 'hero', __( 'Stat 1 label', 'am-international' ), 'text', 'Sending since' ),
		'hero_stat2_value'  => array( 'hero', __( 'Stat 2 figure', 'am-international' ), 'text', 'Trenton' ),
		'hero_stat2_label'  => array( 'hero', __( 'Stat 2 label', 'am-international' ), 'text', 'New Jersey, USA' ),
		'hero_stat3_value'  => array( 'hero', __( 'Stat 3 figure', 'am-international' ), 'text', 'Global' ),
		'hero_stat3_label'  => array( 'hero', __( 'Stat 3 label', 'am-international' ), 'text', 'Campus network' ),

		/* ---- Bible study programme ---- */
		'prog_eyebrow'   => array( 'programme', __( 'Eyebrow', 'am-international' ), 'text', 'Join our Bible Study Program' ),
		'prog_heading'   => array( 'programme', __( 'Heading', 'am-international' ), 'text', 'A 5-phase path from first question to being sent.' ),
		'prog_body'      => array( 'programme', __( 'Body', 'am-international' ), 'textarea', 'AM’s 5-phase Bible Study Program is an online discipleship and Bible education program that leads students through a systematic flow of learning the Gospel of Jesus Christ and the life of faith. The program groups students with Bible teachers who will give instruction according to the listener’s schedule. It culminates with the opportunity to volunteer, train as a student missionary, or simply dive deeper into the Word of God with AM.' ),
		'prog_btn_label' => array( 'programme', __( 'Button label', 'am-international' ), 'text', 'Start the program' ),
		'prog_btn_url'   => array( 'programme', __( 'Button link', 'am-international' ), 'url', '' ),

		/* ---- Connect / Grow / Lead / Sent ---- */
		'stages_eyebrow' => array( 'stages', __( 'Eyebrow', 'am-international' ), 'text', 'Connect · Grow · Lead · Sent' ),
		'stages_heading' => array( 'stages', __( 'Heading', 'am-international' ), 'text', 'Four steps, and we walk every one of them with you.' ),
		'stages_link'    => array( 'stages', __( '"See all" link', 'am-international' ), 'url', '' ),
		'stage_1'        => array( 'stages', __( 'Connect page', 'am-international' ), 'page', 0, __( 'Each card uses the page’s title, excerpt and featured image.', 'am-international' ) ),
		'stage_2'        => array( 'stages', __( 'Grow page', 'am-international' ), 'page', 0 ),
		'stage_3'        => array( 'stages', __( 'Lead page', 'am-international' ), 'page', 0 ),
		'stage_4'        => array( 'stages', __( 'Sent page', 'am-international' ), 'page', 0 ),

		/* ---- mission ---- */
		'mission_eyebrow'     => array( 'mission', __( 'Eyebrow', 'am-international' ), 'text', 'Our mission' ),
		'mission_quote'       => array( 'mission', __( 'Quote (plain part)', 'am-international' ), 'textarea', 'Preach the gospel, make disciples,' ),
		'mission_quote_accent'=> array( 'mission', __( 'Quote (highlighted part)', 'am-international' ), 'text', 'equip leaders, and send them out.' ),
		'mission_quote_end'   => array( 'mission', __( 'Quote (remainder)', 'am-international' ), 'textarea', '' ),
		'mission_link'        => array( 'mission', __( 'Link', 'am-international' ), 'url', '' ),
		'mission_link_label'  => array( 'mission', __( 'Link label', 'am-international' ), 'text', 'Read the full mission statement' ),
		'mission_side'        => array( 'mission', __( 'Side column', 'am-international' ), 'textarea', 'Apostolos Missions International is an interdenominational ministry committed to spreading the gospel to the ends of the earth, testifying to the eternal love of the Lord.' ),
		'mission_side_body'   => array( 'mission', __( 'Side column, second paragraph', 'am-international' ), 'textarea', 'The name apostolos (ἀπόστολος) is the Greek word for apostle. It means “one who is sent on a mission” or “messenger.”' ),

		/* ---- media ---- */
		'media_eyebrow' => array( 'media', __( 'Eyebrow', 'am-international' ), 'text', 'Media' ),
		'media_heading' => array( 'media', __( 'Heading', 'am-international' ), 'text', 'Teaching, testimony and the Word.' ),
		'media_video'   => array( 'media', __( 'Video URL', 'am-international' ), 'url', '', __( 'YouTube, Vimeo or a self-hosted file. Leave blank to show the poster image only.', 'am-international' ) ),
		'media_poster'  => array( 'media', __( 'Poster image', 'am-international' ), 'image', '' ),
		'media_count'   => array( 'media', __( 'How many posts to list', 'am-international' ), 'number', 4 ),

		/* ---- legacy ---- */
		'legacy_eyebrow' => array( 'legacy', __( 'Eyebrow', 'am-international' ), 'text', 'Our first chairman' ),
		'legacy_quote'   => array( 'legacy', __( 'Quote', 'am-international' ), 'textarea', 'AM continues the legacy of world evangelisation established by the missiologist Dr. Ralph D. Winter.' ),
		'legacy_cite'    => array( 'legacy', __( 'Attribution', 'am-international' ), 'text', 'Dr. Ralph D. Winter, 1924–2009' ),
		'legacy_body'    => array( 'legacy', __( 'Body', 'am-international' ), 'textarea', 'Winter opened a new paradigm for the role of churches, mission structures and outreach among unreached people groups. He founded the U.S. Center for World Mission, William Carey International University and the International Society for Frontier Missiology, and served as AM’s first honorary chairman.' ),
		'legacy_image'   => array( 'legacy', __( 'Portrait', 'am-international' ), 'image', '' ),
		'legacy_link'    => array( 'legacy', __( 'Link', 'am-international' ), 'url', '' ),

		/* ---- give band ---- */
		'cta_eyebrow'    => array( 'cta', __( 'Eyebrow', 'am-international' ), 'text', 'Partner with us' ),
		'cta_heading'    => array( 'cta', __( 'Heading', 'am-international' ), 'text', 'Send someone you will never meet.' ),
		'cta_body'       => array( 'cta', __( 'Body', 'am-international' ), 'textarea', 'Every gift puts Bible study, training and a sending community within reach of students who are ready to go.' ),
		'cta_btn1_label' => array( 'cta', __( 'Primary button label', 'am-international' ), 'text', 'Give today' ),
		'cta_btn1_url'   => array( 'cta', __( 'Primary button link', 'am-international' ), 'url', '' ),
		'cta_btn2_label' => array( 'cta', __( 'Secondary button label', 'am-international' ), 'text', 'Talk to us' ),
		'cta_btn2_url'   => array( 'cta', __( 'Secondary button link', 'am-international' ), 'url', '' ),
		'cta_show'       => array( 'cta', __( 'Show this band at the foot of every page', 'am-international' ), 'checkbox', 1 ),

		/* ---- newsletter ---- */
		'news_heading' => array( 'newsletter', __( 'Heading', 'am-international' ), 'text', 'Field notes from the campuses' ),
		'news_body'    => array( 'newsletter', __( 'Body', 'am-international' ), 'textarea', 'A short monthly letter: what students are seeing, where AM is going next, and how to pray.' ),
		'news_action'  => array( 'newsletter', __( 'Form action URL', 'am-international' ), 'url', '', __( 'Paste the form URL from Mailchimp or your email provider. Leave blank and the form will simply say it is not connected.', 'am-international' ) ),
		'news_show'    => array( 'newsletter', __( 'Show the signup form', 'am-international' ), 'checkbox', 1 ),

		/* ---- contact + social ---- */
		'contact_address' => array( 'contact', __( 'Address', 'am-international' ), 'textarea', "Apostolos Missions International\nTrenton, New Jersey, USA" ),
		'contact_email'   => array( 'contact', __( 'Email address', 'am-international' ), 'text', 'info@amintl.org' ),
		'contact_blurb'   => array( 'contact', __( 'Footer blurb', 'am-international' ), 'textarea', 'An interdenominational ministry committed to spreading the gospel to the ends of the earth, testifying to the eternal love of the Lord.' ),
		'contact_tagline' => array( 'contact', __( 'Utility bar tagline', 'am-international' ), 'text', 'Apostolos · One who is sent on a mission' ),
		'social_facebook' => array( 'contact', __( 'Facebook URL', 'am-international' ), 'url', '' ),
		'social_instagram'=> array( 'contact', __( 'Instagram URL', 'am-international' ), 'url', '' ),
		'social_youtube'  => array( 'contact', __( 'YouTube URL', 'am-international' ), 'url', '' ),
		'header_cta_label'=> array( 'contact', __( 'Header button label', 'am-international' ), 'text', 'Give' ),
		'header_cta_url'  => array( 'contact', __( 'Header button link', 'am-international' ), 'url', '' ),
	);

	// Normalise the positional arrays into something readable.
	foreach ( $settings as $key => $row ) {
		$settings[ $key ] = array(
			'section'     => $row[0],
			'label'       => $row[1],
			'type'        => $row[2],
			'default'     => isset( $row[3] ) ? $row[3] : '',
			'description' => isset( $row[4] ) ? $row[4] : '',
		);
	}

	return $settings;
}

/**
 * Registers the panel, sections and controls.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function am_customize_register( $wp_customize ) {
	$wp_customize->add_panel( 'am_home', array(
		'title'       => __( 'AM homepage', 'am-international' ),
		'description' => __( 'Copy for each band on the homepage. News, events, chapters and ministries come from their own menus in the admin sidebar.', 'am-international' ),
		'priority'    => 20,
	) );

	$sections = array(
		'hero'       => array( __( 'Hero + globe', 'am-international' ), 'am_home' ),
		'programme'  => array( __( 'Bible Study Program', 'am-international' ), 'am_home' ),
		'stages'     => array( __( 'Connect / Grow / Lead / Sent', 'am-international' ), 'am_home' ),
		'mission'    => array( __( 'Mission band', 'am-international' ), 'am_home' ),
		'media'      => array( __( 'Media', 'am-international' ), 'am_home' ),
		'legacy'     => array( __( 'Ralph D. Winter band', 'am-international' ), 'am_home' ),
		'cta'        => array( __( 'Give band', 'am-international' ), 'am_home' ),
		'newsletter' => array( __( 'Newsletter', 'am-international' ), 'am_home' ),
		'contact'    => array( __( 'Contact, social & header button', 'am-international' ), '' ),
	);

	foreach ( $sections as $id => $meta ) {
		$args = array(
			'title'    => $meta[0],
			'priority' => 30,
		);
		if ( $meta[1] ) {
			$args['panel'] = $meta[1];
		}
		$wp_customize->add_section( 'am_section_' . $id, $args );
	}

	$sanitizers = array(
		'text'     => 'sanitize_text_field',
		'textarea' => 'wp_kses_post',
		'url'      => 'esc_url_raw',
		'page'     => 'absint',
		'image'    => 'esc_url_raw',
		'number'   => 'absint',
		'checkbox' => 'am_sanitize_checkbox',
	);

	foreach ( am_settings() as $key => $setting ) {
		$type      = $setting['type'];
		$sanitizer = isset( $sanitizers[ $type ] ) ? $sanitizers[ $type ] : 'sanitize_text_field';

		$wp_customize->add_setting( 'am_' . $key, array(
			'default'           => $setting['default'],
			'sanitize_callback' => $sanitizer,
			'transport'         => 'refresh',
		) );

		$control_args = array(
			'label'       => $setting['label'],
			'section'     => 'am_section_' . $setting['section'],
			'description' => $setting['description'],
		);

		switch ( $type ) {
			case 'textarea':
				$control_args['type'] = 'textarea';
				$wp_customize->add_control( 'am_' . $key, $control_args );
				break;

			case 'page':
				$control_args['type']    = 'dropdown-pages';
				$control_args['allow_addition'] = true;
				$wp_customize->add_control( 'am_' . $key, $control_args );
				break;

			case 'image':
				$wp_customize->add_control(
					new WP_Customize_Image_Control( $wp_customize, 'am_' . $key, $control_args )
				);
				break;

			case 'checkbox':
				$control_args['type'] = 'checkbox';
				$wp_customize->add_control( 'am_' . $key, $control_args );
				break;

			case 'number':
				$control_args['type']        = 'number';
				$control_args['input_attrs'] = array( 'min' => 1, 'max' => 10 );
				$wp_customize->add_control( 'am_' . $key, $control_args );
				break;

			case 'url':
				$control_args['type'] = 'url';
				$wp_customize->add_control( 'am_' . $key, $control_args );
				break;

			default:
				$control_args['type'] = 'text';
				$wp_customize->add_control( 'am_' . $key, $control_args );
		}
	}

	// Live-preview the simple text bits.
	foreach ( array( 'hero_title', 'hero_title_accent', 'hero_lede', 'cta_heading' ) as $key ) {
		$setting = $wp_customize->get_setting( 'am_' . $key );
		if ( $setting ) {
			$setting->transport = 'refresh';
		}
	}
}
add_action( 'customize_register', 'am_customize_register' );

/**
 * Checkboxes come back as '1' or nothing.
 */
function am_sanitize_checkbox( $value ) {
	return ( isset( $value ) && $value ) ? 1 : 0;
}
