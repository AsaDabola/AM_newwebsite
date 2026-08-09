<?php
/**
 * Navigation walkers.
 *
 * The header mega menu reads a three-level WordPress menu:
 *
 *   Who We Are            <- depth 0, becomes the top-level button
 *     The ministry        <- depth 1, becomes a column heading
 *       Who we are        <- depth 2, becomes a link in that column
 *       Mission statement
 *     People
 *       Leadership
 *
 * A depth-0 item with no children is rendered as a plain link. If a depth-0
 * item has a Description filled in (Screen Options -> Description in the menu
 * editor), it is shown as the highlighted panel on the right of the menu.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

/**
 * Header mega menu.
 */
class AM_Walker_Mega extends Walker_Nav_Menu {

	/** @var bool Whether the item currently being rendered has a feature panel. */
	protected $pending_feature = '';

	/**
	 * Opens a level. Depth 0 -> the mega menu shell; depth 1 -> a link list.
	 */
	public function start_lvl( &$output, $depth = 0, $args = null ) {
		if ( 0 === $depth ) {
			$output .= '<div class="megamenu"><div class="container megamenu__inner"><div class="megamenu__cols">';
		} elseif ( 1 === $depth ) {
			$output .= '<ul class="megamenu__links">';
		}
	}

	/**
	 * Closes a level, adding the feature panel after the columns.
	 */
	public function end_lvl( &$output, $depth = 0, $args = null ) {
		if ( 0 === $depth ) {
			$output .= '</div>'; // .megamenu__cols

			if ( $this->pending_feature ) {
				$output .= $this->pending_feature;
				$this->pending_feature = '';
			}

			$output .= '</div></div>'; // .megamenu__inner, .megamenu
		} elseif ( 1 === $depth ) {
			$output .= '</ul>';
		}
	}

	/**
	 * Renders one item, switching markup by depth.
	 */
	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
		$title      = apply_filters( 'the_title', $item->title, $item->ID );
		$url        = $item->url ? esc_url( $item->url ) : '';
		$has_kids   = in_array( 'menu-item-has-children', (array) $item->classes, true );
		$is_current = in_array( 'current-menu-item', (array) $item->classes, true )
			|| in_array( 'current-menu-ancestor', (array) $item->classes, true )
			|| in_array( 'current-menu-parent', (array) $item->classes, true );
		$aria       = $is_current ? ' aria-current="page"' : '';

		if ( 0 === $depth ) {
			if ( $has_kids ) {
				$output .= '<li class="nav__item nav__item--has-menu">';
				$output .= sprintf(
					'<button class="nav__link" type="button" aria-expanded="false" data-href="%s"%s>%s %s</button>',
					$url,
					$aria,
					esc_html( $title ),
					am_icon( 'chevron' )
				);

				// Stash the feature panel; end_lvl prints it after the columns.
				$this->pending_feature = $this->feature_panel( $item, $url );
			} else {
				$output .= '<li class="nav__item">';
				$output .= sprintf(
					'<a class="nav__link" href="%s"%s>%s</a>',
					$url,
					$aria,
					esc_html( $title )
				);
			}
			return;
		}

		if ( 1 === $depth ) {
			$output .= '<div class="megamenu__col">';

			if ( $has_kids ) {
				// A heading for the links beneath it.
				$output .= '<h3 class="megamenu__title">' . esc_html( $title ) . '</h3>';
			} else {
				// No children, so this is a lone link that still needs a column.
				$output .= '<h3 class="megamenu__title"><a href="' . $url . '">' . esc_html( $title ) . '</a></h3>';
			}
			return;
		}

		$output .= '<li><a href="' . $url . '"' . $aria . '>' . esc_html( $title ) . '</a></li>';
	}

	/**
	 * Closes an item. Only depths 0 and 1 own a wrapper.
	 */
	public function end_el( &$output, $item, $depth = 0, $args = null ) {
		if ( 0 === $depth ) {
			$output .= '</li>';
		} elseif ( 1 === $depth ) {
			$output .= '</div>';
		}
	}

	/**
	 * Builds the promoted panel on the right of a mega menu from the menu
	 * item's description. Returns an empty string when there is no description.
	 */
	protected function feature_panel( $item, $url ) {
		$description = trim( (string) $item->description );
		if ( '' === $description ) {
			return '';
		}

		$label = $item->attr_title ? $item->attr_title : __( 'Learn more', 'am-international' );

		return sprintf(
			'<div class="megamenu__feature"><h4>%s</h4><p>%s</p><a class="link-arrow" href="%s">%s %s</a></div>',
			esc_html( apply_filters( 'the_title', $item->title, $item->ID ) ),
			esc_html( $description ),
			$url,
			esc_html( $label ),
			am_icon( 'arrow' )
		);
	}
}

/**
 * Mobile drawer. Top-level items become collapsible groups; everything below
 * is flattened into a single list of links inside the group.
 */
class AM_Walker_Drawer extends Walker_Nav_Menu {

	public function start_lvl( &$output, $depth = 0, $args = null ) {
		if ( 0 === $depth ) {
			$output .= '<div class="drawer__panel">';
		}
	}

	public function end_lvl( &$output, $depth = 0, $args = null ) {
		if ( 0 === $depth ) {
			$output .= '</div>';
		}
	}

	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
		$title    = apply_filters( 'the_title', $item->title, $item->ID );
		$url      = $item->url ? esc_url( $item->url ) : '';
		$has_kids = in_array( 'menu-item-has-children', (array) $item->classes, true );

		if ( 0 === $depth ) {
			$output .= '<div class="drawer__group">';
			if ( $has_kids ) {
				$output .= sprintf(
					'<button class="drawer__toggle" type="button" aria-expanded="false">%s %s</button>',
					esc_html( $title ),
					am_icon( 'chevron' )
				);
			} else {
				$output .= '<a class="drawer__toggle" href="' . $url . '">' . esc_html( $title ) . '</a>';
			}
			return;
		}

		// Depth 1 headings would only add noise on a phone, so every descendant
		// is rendered as a flat link.
		$output .= '<a href="' . $url . '">' . esc_html( $title ) . '</a>';
	}

	public function end_el( &$output, $item, $depth = 0, $args = null ) {
		if ( 0 === $depth ) {
			$output .= '</div>';
		}
	}
}

/**
 * Prints the primary menu, or a prompt for an administrator when none is set.
 *
 * @param string $location Menu location slug.
 * @param string $style    Either 'mega' or 'drawer'.
 */
function am_nav_menu( $location, $style = 'mega' ) {
	if ( ! has_nav_menu( $location ) ) {
		if ( current_user_can( 'edit_theme_options' ) ) {
			printf(
				'<li class="nav__item"><a class="nav__link" href="%s">%s</a></li>',
				esc_url( admin_url( 'nav-menus.php' ) ),
				esc_html__( 'Set up a menu', 'am-international' )
			);
		}
		return;
	}

	wp_nav_menu( array(
		'theme_location' => $location,
		'container'      => false,
		'items_wrap'     => '%3$s',
		'depth'          => 'drawer' === $style ? 0 : 3,
		'walker'         => 'drawer' === $style ? new AM_Walker_Drawer() : new AM_Walker_Mega(),
		'fallback_cb'    => false,
	) );
}

/**
 * A plain list menu, used for the utility bar and footer columns.
 */
function am_simple_menu( $location, $class = '' ) {
	if ( ! has_nav_menu( $location ) ) {
		return;
	}

	wp_nav_menu( array(
		'theme_location' => $location,
		'container'      => false,
		'menu_class'     => $class,
		'depth'          => 1,
		'fallback_cb'    => false,
	) );
}
