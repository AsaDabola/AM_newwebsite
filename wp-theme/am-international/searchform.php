<?php
/**
 * Search form.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;
?>
<form class="finder__form" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<div class="field">
		<span class="field__icon"><?php echo am_icon( 'search' ); // phpcs:ignore WordPress.Security.EscapeOutput ?></span>
		<label class="visually-hidden" for="s-<?php echo esc_attr( uniqid() ); ?>"><?php esc_html_e( 'Search', 'am-international' ); ?></label>
		<input type="search" name="s" placeholder="<?php esc_attr_e( 'Search the site', 'am-international' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>">
	</div>
	<button class="btn" type="submit"><?php esc_html_e( 'Search', 'am-international' ); ?></button>
</form>
