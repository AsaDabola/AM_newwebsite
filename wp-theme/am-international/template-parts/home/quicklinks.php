<?php
/**
 * The four audience paths that sit under the hero.
 *
 * Driven by the "Homepage quick links" menu. Each menu item becomes a card:
 * the item title is the heading, its Description is the supporting line, and
 * a CSS class of am-icon-pin / am-icon-book / am-icon-users / am-icon-heart /
 * am-icon-globe / am-icon-send picks the icon.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

if ( ! has_nav_menu( 'quicklinks' ) ) {
	return;
}

$locations = get_nav_menu_locations();
$menu_id   = isset( $locations['quicklinks'] ) ? $locations['quicklinks'] : 0;
$items     = $menu_id ? wp_get_nav_menu_items( $menu_id ) : array();

if ( ! $items ) {
	return;
}

/**
 * Pulls an icon name out of the menu item's CSS classes.
 */
$icon_for = function ( $item ) {
	foreach ( (array) $item->classes as $class ) {
		if ( 0 === strpos( $class, 'am-icon-' ) ) {
			return substr( $class, 8 );
		}
	}
	return 'pin';
};
?>
<section class="quicklinks">
	<div class="container">
		<div class="quicklinks__grid">
			<?php foreach ( $items as $item ) : ?>
				<?php
				// Only top-level items are cards; any children are ignored here.
				if ( $item->menu_item_parent ) {
					continue;
				}
				?>
				<a class="quicklink" href="<?php echo esc_url( $item->url ); ?>" data-reveal>
					<span class="quicklink__icon"><?php echo am_icon( $icon_for( $item ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></span>
					<h3><?php echo esc_html( $item->title ); ?></h3>
					<?php if ( $item->description ) : ?>
						<p><?php echo esc_html( $item->description ); ?></p>
					<?php endif; ?>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>
